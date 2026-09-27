# Skill: React Context State Management

## Purpose

Provides the engineering pattern for managing **shared application state** in React using the `useReducer` + `Context` pattern with localStorage persistence, derived values, action dispatchers, and custom hooks with safety guards.

## When to Use

- You need state shared across multiple components that don't have a direct parent-child relationship (e.g., shopping cart, user session, theme preferences).
- The state has multiple related values and actions that modify it (more than 2-3 `useState` calls).
- The state needs to persist across page refreshes (localStorage hydration).
- You want predictable state transitions without introducing an external library (Redux, Zustand, Jotai).

## When NOT to Use

- The state is local to a single component or a small parent-child tree — use `useState`.
- The state is server-derived and needs caching, deduplication, or background refetching — use a data-fetching library (React Query, SWR).
- The application has dozens of independent global stores with frequent cross-store interactions — consider a dedicated state manager.
- The state updates cause re-renders across hundreds of consuming components — consider store selectors or atomic state (Jotai, Zustand).

## Prerequisites

- Understanding of React hooks: `useReducer`, `useContext`, `useEffect`, `useCallback`.
- Understanding of the Context Provider/Consumer pattern.

## Core Principles

1. **Single source of truth.** One context provider owns the state. Consumers access it through a custom hook.
2. **Predictable updates via reducer.** All state modifications flow through dispatched actions. No direct state mutation.
3. **Hydration on mount, persistence on change.** State is loaded from localStorage once (via `useReducer` initialiser), and synced back whenever it changes (via `useEffect`).
4. **Derived values computed in the provider.** Calculated values (totals, counts, boolean flags) are computed in the provider and exposed alongside raw state.
5. **Custom hook with guard clause.** A dedicated `useXxx()` hook wraps `useContext` and throws a clear error if used outside the provider.
6. **UI state co-location.** Transient UI state (drawer open/closed) can be co-located in the same reducer when it's tightly coupled to the data state.

## General Pattern

### 1. Define the State Shape and Initial Value

```javascript
const STORAGE_KEY = 'app_feature_v1';

const initialState = {
  items: [],           // Core data
  isDrawerOpen: false, // Co-located UI state
};
```

### 2. Hydration Function

```javascript
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      isDrawerOpen: false, // Never restore transient UI state
    };
  } catch {
    return initialState; // Corrupt storage → fresh start
  }
}
```

**Key decisions:**
- Validate the shape of parsed data (check `Array.isArray`, check for expected keys).
- Never restore transient UI state (modals, drawers) from storage.
- Silently fall back to initial state on parse errors.

### 3. Reducer

```javascript
function featureReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN_DRAWER':
      return { ...state, isDrawerOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, isDrawerOpen: false };
    default:
      return state;
  }
}
```

**Key decisions:**
- Each case returns a new object (immutability).
- Business logic (duplicate detection, quantity increment) lives in the reducer.
- Unknown actions return state unchanged (no errors).

### 4. Context and Provider

```javascript
const FeatureContext = createContext(null);

export function FeatureProvider({ children }) {
  const [state, dispatch] = useReducer(featureReducer, undefined, loadFromStorage);

  // Persist to localStorage on data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
      // Storage quota exceeded or private browsing — silently ignore
    }
  }, [state.items]);

  // Derived values
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => {
    const price = Number(i.price);
    return !isNaN(price) ? sum + price * i.quantity : sum;
  }, 0);

  // Action functions (stable references via dispatch)
  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const clear = () => dispatch({ type: 'CLEAR' });
  const openDrawer = () => dispatch({ type: 'OPEN_DRAWER' });
  const closeDrawer = () => dispatch({ type: 'CLOSE_DRAWER' });

  // Query functions
  const isInList = (id) => state.items.some(i => i.id === id);
  const getItemQty = (id) => state.items.find(i => i.id === id)?.quantity ?? 0;

  return (
    <FeatureContext.Provider
      value={{
        items: state.items,
        isDrawerOpen: state.isDrawerOpen,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        clear,
        openDrawer,
        closeDrawer,
        isInList,
        getItemQty,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
}
```

### 5. Custom Hook with Guard

```javascript
export function useFeature() {
  const ctx = useContext(FeatureContext);
  if (!ctx) {
    throw new Error('useFeature must be used inside <FeatureProvider>');
  }
  return ctx;
}
```

### 6. Provider Placement

```jsx
// In the app entry
<FeatureProvider>
  <App />
</FeatureProvider>
```

## Recommended Workflow

1. **Define the state shape** — list every piece of data and UI state this context owns.
2. **Define actions** — list every way the state can change.
3. **Write the reducer** — implement each action as a pure function.
4. **Write the hydration function** — with defensive parsing and fallback.
5. **Write the provider** — with persistence effect, derived values, and action helpers.
6. **Write the custom hook** — with the guard clause.
7. **Place the provider** — high enough in the tree to cover all consumers, but not higher than necessary.
8. **Test the guard** — intentionally use the hook outside the provider to confirm the error message is clear.

## Decision Points

### When to co-locate UI state in the reducer vs. separate useState

**Co-locate** when the UI state is tightly coupled to the data (e.g., "open the cart drawer after adding an item"). **Separate** when the UI state is independent (e.g., form field focus).

### When to persist and what to exclude

- **Persist**: Data the user would expect to survive a page refresh (cart items, preferences).
- **Exclude**: Transient UI state (modals open, scroll position), derived values, loading states.

### Versioned storage keys

Use a version suffix (`_v1`) in the storage key. When the state shape changes in a breaking way, increment the version. The old key becomes invisible, and users get fresh state.

## Common Mistakes

1. **Not validating hydrated data.** If a previous version stored `{ cart: [...] }` and the new version expects `{ items: [...] }`, the app crashes on load.
2. **Persisting the entire state.** Drawer open/close state, loading flags, and error messages should not be persisted.
3. **Creating a new object reference for the provider value on every render.** This causes all consumers to re-render. Use `useMemo` if the provider's parent re-renders frequently.
4. **Forgetting the `try/catch` around `localStorage`.** Private browsing and storage quota limits can throw.
5. **Using `createContext(undefined)` instead of `createContext(null)`.** With `undefined`, the guard clause `if (!ctx)` won't catch the "used outside provider" case because `undefined` is falsy but `0`, `""`, and `false` are also falsy.

## Security Considerations

- **Never store sensitive data** (tokens, passwords, API keys) in localStorage. It is accessible to any JavaScript running on the same origin (XSS vulnerability).
- **Auth session state** should use the authentication library's built-in session management (cookies, secure storage), not this localStorage pattern.
- **Validate and sanitise** any data loaded from localStorage before using it in the application. Treat it as untrusted input.

## Debugging

| Symptom | Likely Cause |
|---------|-------------|
| State resets on every page refresh | Hydration function not connected (`useReducer` third argument missing) |
| Old data persists after schema change | Storage key not versioned — old shape is hydrated into new reducer |
| "useXxx must be used inside Provider" error | Provider not placed high enough in the component tree, or the component renders before the provider mounts |
| Stale closure in action function | Action function captures stale `state` — use `dispatch` instead of closure over state |
| All consumers re-render on any change | Provider value object recreated every render — memoize or restructure |

## Production Considerations

- **Storage limits**: `localStorage` typically has a 5-10 MB limit. If the state can grow unbounded (e.g., user-generated content), consider IndexedDB or periodic pruning.
- **Migration**: When deploying a breaking state shape change, consider a one-time migration function that reads the old key and writes the new shape, rather than losing user data.
- **SSR compatibility**: `localStorage` is not available during server-side rendering. Guard access with `typeof window !== 'undefined'` checks.

## Shivaay Example

Shivaay Enterprise implements two Context providers:

**CartContext** (`src/context/CartContext.jsx`):
- `useReducer` with 6 action types: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QTY`, `CLEAR_CART`, `OPEN_DRAWER`, `CLOSE_DRAWER`.
- `loadFromStorage()` hydrates from `localStorage` key `shivaay_cart_v1`, validating that `items` is an array and resetting `isDrawerOpen` to `false`.
- Derived values: `totalItems`, `subtotal`, `hasPricelessItems` (some products have "enquire for price").
- Query functions: `isInCart(id)`, `getItemQty(id)`.
- `useCart()` hook with guard clause.

**CustomerAuthContext** (`src/context/CustomerAuthContext.jsx`):
- Uses `useState` (not `useReducer`) because the state is simpler: `session` and `loading`.
- Subscribes to `supabase.auth.onAuthStateChange` in `useEffect` to reactively track auth state.
- Exposes `session`, `user` (derived), `loading`, and `signOut` (memoised with `useCallback`).
- `useCustomerAuth()` hook with guard clause.

The cart provider wraps the entire public app, while the customer auth provider is nested inside it (because cart state exists independently of authentication).

## Anti-Patterns

- **God context**: Putting all application state into one massive context (auth, cart, theme, notifications). This causes unnecessary re-renders and makes the code harder to reason about.
- **Direct dispatch exposure**: Exposing `dispatch` to consumers instead of named action functions. Consumers shouldn't know the action type strings.
- **Derived values in consumers**: Computing totals or filtered lists in every consuming component instead of once in the provider.
- **Missing error boundaries**: If the hydration function throws, the entire app crashes without a meaningful error.

## Validation Checklist

- [ ] Context initialised with `null` (not `undefined`)
- [ ] `useReducer` uses the third argument (lazy initialiser) for hydration
- [ ] Hydration function validates data shape and falls back gracefully
- [ ] Persistence effect only writes the data that should survive refresh
- [ ] Transient UI state is reset on hydration
- [ ] Storage key is versioned
- [ ] Custom hook throws a descriptive error when used outside the provider
- [ ] Provider value exposes action functions (not raw dispatch)
- [ ] Derived values are computed in the provider
- [ ] `try/catch` around all `localStorage` operations

## Related Skills

- [React Data Fetching Patterns](../react-data-fetching-patterns/SKILL.md) — Complementary pattern for server-derived state
- [Authentication & Authorisation Architecture](../../security/authentication-authorization-architecture/SKILL.md) — Auth context follows a similar pattern

## Repository Evidence

- [`src/context/CartContext.jsx`](../../src/context/CartContext.jsx) — Full useReducer + localStorage + derived values + custom hook implementation
- [`src/context/CustomerAuthContext.jsx`](../../src/context/CustomerAuthContext.jsx) — Auth state management with Supabase listener
- [`src/App.jsx`](../../src/App.jsx) — Provider nesting order (CartProvider wraps CustomerAuthProvider)

## Limitations

- The Shivaay project does not use `useMemo` on the provider value object. Whether this causes performance issues in a larger app was not investigated.
- Context splitting strategies (separating state and dispatch into different contexts) were not employed.
- This pattern does not address server-side rendering (SSR) hydration concerns.
