import React, { createContext, useContext, useReducer, useEffect } from 'react';

// ─── Storage Key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'shivaay_cart_v1';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  items: [],          // [{ id, name, price, image_url, quantity }]
  isDrawerOpen: false,
};

// ─── Hydrate from localStorage ────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      isDrawerOpen: false, // never re-open drawer on refresh
    };
  } catch {
    return initialState;
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: action.payload.id,
            name: action.payload.name,
            price: action.payload.price ?? null,
            image_url: action.payload.image_url ?? null,
            quantity: 1,
          },
        ],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case 'UPDATE_QTY': {
      const newQty = Math.max(1, action.payload.quantity);
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: newQty } : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'OPEN_DRAWER':
      return { ...state, isDrawerOpen: true };

    case 'CLOSE_DRAWER':
      return { ...state, isDrawerOpen: false };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

  // Persist items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
      // Storage quota exceeded or private browsing — silently ignore
    }
  }, [state.items]);

  // ─── Derived Values ──────────────────────────────────────────────────────────
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = state.items.reduce((sum, i) => {
    if (i.price != null && !isNaN(Number(i.price))) {
      return sum + Number(i.price) * i.quantity;
    }
    return sum;
  }, 0);

  const hasPricelessItems = state.items.some(
    (i) => i.price == null || isNaN(Number(i.price))
  );

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const addToCart = (product) =>
    dispatch({ type: 'ADD_ITEM', payload: product });

  const removeFromCart = (id) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });

  const updateQty = (id, quantity) =>
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const openDrawer = () => dispatch({ type: 'OPEN_DRAWER' });

  const closeDrawer = () => dispatch({ type: 'CLOSE_DRAWER' });

  const isInCart = (id) => state.items.some((i) => i.id === id);

  const getItemQty = (id) => {
    const item = state.items.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isDrawerOpen: state.isDrawerOpen,
        totalItems,
        subtotal,
        hasPricelessItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        openDrawer,
        closeDrawer,
        isInCart,
        getItemQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}
