# Skill: Authentication & Authorisation Architecture

## Purpose

Provides the engineering pattern for implementing **dual-audience authentication** (e.g., customers via OAuth + admins via email/password) with **role-based authorisation**, separate protected route guards, OAuth callback handling, and session management in a React + Supabase application.

## When to Use

- Your application has two or more user audiences with different authentication methods and privilege levels.
- You need route-level access control that redirects unauthenticated or unauthorised users.
- You are implementing OAuth (Google, GitHub, etc.) alongside traditional email/password authentication.
- You need to distinguish between "this user is logged in" (authentication) and "this user is allowed to access this resource" (authorisation).

## When NOT to Use

- Your application has a single user type with no role distinctions — a simple session check suffices.
- You are building a fully server-rendered application where auth is handled at the middleware layer, not in client-side route guards.
- Your auth is entirely handled by an external identity provider with its own dashboard and role management.

## Prerequisites

- Understanding of authentication (proving identity) vs. authorisation (granting access).
- Familiarity with OAuth 2.0 flows (implicit, PKCE, authorization code).
- Understanding of React Router (or your routing library's guard/middleware concept).
- Familiarity with your auth provider (Supabase Auth, Firebase Auth, Auth0, etc.).

## Core Principles

1. **Separate authentication from authorisation.** Authentication answers "who is this user?". Authorisation answers "what is this user allowed to do?". They are implemented in separate layers.
2. **Auth context provides session state.** A React context subscribes to auth state changes and exposes `session`, `user`, `loading`, and `signOut` to the entire app.
3. **Protected routes guard access.** Wrapper components check auth state before rendering children. Unauthenticated users are redirected to login; unauthorised users see an access-denied screen.
4. **Role verification happens server-side.** Client-side route guards are UX conveniences. True authorisation enforcement must happen at the database or API layer (RLS, middleware).
5. **Different audiences use different auth flows.** Customers might use OAuth for convenience; admins use email/password for security. These flows should be physically separated.

## General Pattern

### 1. Auth Context

```jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed current session
    authClient.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
      setLoading(false);
    });

    // Subscribe to changes (login, logout, token refresh)
    const { data: { subscription } } = authClient.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const signOut = useCallback(async () => {
    await authClient.signOut();
    navigate('/');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
```

**Key: `session` has three states:**
- `undefined` — still loading (show spinner)
- `null` — no session (user is signed out)
- `object` — valid session (user is signed in)

### 2. Customer Protected Route (Authentication Only)

```jsx
export function CustomerProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

**Note:** Saves the attempted URL in `state.from` so the login page can redirect back after successful authentication.

### 3. Admin Protected Route (Authentication + Authorisation)

```jsx
export function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await authClient.getSession();

      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Authorisation: check role in the database
      const { data: profile } = await dbClient
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      setIsAdmin(profile?.role === 'admin');
      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <AccessDeniedScreen />;

  return children;
}
```

**Key difference from customer route:** The admin route does a **database lookup** to verify the user has the admin role, not just that they have a valid session.

### 4. OAuth Callback Handler

```jsx
function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Auth client processes the URL hash/code automatically
    const { data: { subscription } } = authClient.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe();
          navigate('/profile', { replace: true });
        }
      }
    );

    // Safety timeout — if no auth event fires, something went wrong
    const timeout = setTimeout(() => {
      authClient.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate('/profile', { replace: true });
        } else {
          setError('Authentication could not be completed.');
        }
      });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  if (error) return <ErrorScreen message={error} />;
  return <LoadingScreen message="Completing sign-in…" />;
}
```

**Key patterns:**
- Listen for the `SIGNED_IN` event from the auth state change listener.
- Set a safety timeout (8 seconds) in case the event never fires (network issues, misconfigured OAuth).
- Render a loading spinner while waiting, an error screen on failure.

### 5. Route Configuration

```jsx
// Public routes
<Route path="/login" element={<LoginPage />} />
<Route path="/auth/callback" element={<AuthCallback />} />
<Route path="/profile" element={
  <CustomerProtectedRoute><ProfilePage /></CustomerProtectedRoute>
} />

// Admin routes (in a SEPARATE entry point)
<Route path="/admin/login" element={<AdminLoginPage />} />
<Route path="/admin/dashboard" element={
  <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
} />
```

## Recommended Workflow

1. **Implement the auth context** with session state, loading flag, and auth state listener.
2. **Create the simple protected route** (authentication only) for customer pages.
3. **Create the admin protected route** (authentication + role check) for admin pages.
4. **Implement the login pages** — separate pages for each audience.
5. **Implement the OAuth callback** handler with safety timeout.
6. **Wire up the routes** — protected routes wrap the components, not the routes.
7. **Implement server-side enforcement** — RLS policies or API middleware that enforce the same rules.
8. **Test the edge cases** — direct URL access, expired sessions, wrong role.

## Decision Points

### Separate auth providers or one?

- **Separate** (recommended): Each audience has its own context provider with its own session management logic. Prevents auth state conflicts.
- **Shared**: One provider with a role flag. Simpler but riskier — a customer session could be used to access admin routes if the client-side guard fails.

### Where to check roles — client or server?

- **Both.** The client-side check provides good UX (redirect instead of error). The server-side check (RLS, middleware) provides actual security. Never rely on the client check alone.

### `maybeSingle()` vs `single()` for profile lookup

- `maybeSingle()` returns `null` if no row matches (non-admin user has no profile row).
- `single()` throws an error if no row matches.
- Use `maybeSingle()` to avoid treating "no profile" as a crash.

## Common Mistakes

1. **Checking auth state synchronously.** Auth state is asynchronous. Rendering the protected content before the auth check completes exposes it briefly.
2. **Not handling the "loading" state.** The app flashes the login page before the session is verified, even for authenticated users.
3. **Trusting client-side role checks.** A user can modify JavaScript to bypass `isAdmin`. Server-side enforcement (RLS) is mandatory.
4. **Sharing auth providers across entries.** The admin entry should not use the customer auth provider, and vice versa.
5. **Not cleaning up auth listeners.** Forgetting to unsubscribe from `onAuthStateChange` causes memory leaks and stale state.
6. **Hardcoding redirect URLs.** The OAuth redirect URL must match what's configured in the OAuth provider. Use `window.location.origin` for portability.

## Security Considerations

- **Client-side guards are UX, not security.** Any user can inspect the JavaScript bundle, find admin routes, and attempt to access them. The database (RLS) and API layer must independently enforce access control.
- **Separate admin auth from customer auth.** Don't allow OAuth-authenticated customers to access admin routes just because they have a valid session. The admin route guard must verify the admin role in the database.
- **Signed JWT tokens can be inspected.** The Supabase JWT contains the user's ID and role claims, but role claims in the JWT may be stale. Always verify against the database for critical access decisions.
- **OAuth redirect URL validation.** Ensure the OAuth provider only redirects to your known callback URLs. Misconfiguration can lead to token theft.
- **Session expiry and refresh.** Auth libraries typically handle token refresh automatically, but test what happens when a refresh fails (e.g., the user revoked access).

## Debugging

| Symptom | Likely Cause |
|---------|-------------|
| Admin logged in but sees "Access Denied" | Profile row missing or role value doesn't match expected string |
| Login succeeds but redirects back to login | Auth state listener not updating the session state; or the protected route re-renders before the new session propagates |
| OAuth callback shows timeout error | OAuth provider not configured correctly; redirect URL mismatch; or the auth client's `detectSessionInUrl` is disabled |
| Customer sees admin content briefly | Loading state not handled — content renders before auth check completes |
| Logout doesn't work | `signOut()` not awaited; or the auth state listener doesn't handle `SIGNED_OUT` event |

## Production Considerations

- **Rate limiting on login endpoints.** Prevent brute-force attacks on email/password login.
- **Account lockout.** After N failed login attempts, temporarily block the account.
- **Secure session storage.** Use HTTP-only cookies where possible. Supabase uses localStorage by default for the session token.
- **Token rotation.** Auth libraries typically handle this, but verify that token refresh works correctly across long-lived sessions.
- **Audit logging.** Log admin login events for security auditing.

## Shivaay Example

Shivaay Enterprise implements dual-audience authentication:

**Customer auth** (`src/context/CustomerAuthContext.jsx` + `src/pages/Login.jsx`):
- Google OAuth via `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- OAuth callback at `/auth/callback` (`src/pages/AuthCallback.jsx`) with 8-second safety timeout.
- `CustomerProtectedRoute` wraps `/profile` — checks session only, no role check needed.
- Redirects to `/login` with `state.from` to enable post-login redirect.

**Admin auth** (`src/pages/admin/AdminLogin.jsx` + `src/components/auth/AdminProtectedRoute.jsx`):
- Email/password via `supabase.auth.signInWithPassword()`.
- `AdminProtectedRoute` checks session validity AND queries `profiles.role === 'admin'` via `.maybeSingle()`.
- Three-state rendering: loading spinner → redirect to `/admin/login` (no session) → access denied screen (wrong role) → children (admin).
- The access denied screen includes debug info (`debugMsg`) showing profile lookup results — useful during development, should be removed in production.

**Enforcement layers:**
- Client: `AdminProtectedRoute` and `CustomerProtectedRoute`.
- Database: RLS policies on `products` (admin-only write, public read), `customers` (owner-only), `customer_addresses` (owner-only). See [Row Level Security Design](../row-level-security-design/SKILL.md).

**Dual Supabase clients** (`src/lib/supabase.js`):
- `supabase`: Standard client with session persistence (used for authenticated operations).
- `publicSupabase`: Client with `persistSession: false` (used for public data fetching to avoid auth-dependent query results).

## Anti-Patterns

- **"Security by obscurity"**: Hiding the admin URL instead of protecting it with real auth + authorisation.
- **Role in the JWT only**: Relying on JWT role claims without a database lookup. JWT claims can be stale if the role was changed after token issuance.
- **Single protected route for all roles**: Using one `<ProtectedRoute requiredRole="admin">` that handles both auth and authz. This conflates two concerns and makes it harder to provide role-specific UX (redirect vs. access denied).
- **Logout that only clears client state**: Calling `setSession(null)` without `authClient.signOut()`. The server-side session remains valid.

## Validation Checklist

- [ ] Auth context handles three session states: loading (`undefined`), signed out (`null`), signed in (object)
- [ ] Auth state listener is subscribed on mount and unsubscribed on unmount
- [ ] Customer protected route shows loading spinner during auth check
- [ ] Customer protected route redirects to login with `state.from` for post-login redirect
- [ ] Admin protected route checks session validity AND role in the database
- [ ] Admin protected route shows access denied (not redirect) for authenticated non-admin users
- [ ] OAuth callback has a safety timeout
- [ ] Login pages are separate for each audience
- [ ] Server-side enforcement (RLS/middleware) mirrors client-side guards
- [ ] `signOut()` calls the auth provider's sign-out method (not just local state clearing)

## Related Skills

- [Row Level Security Design](../../security/row-level-security-design/SKILL.md) — Server-side authorisation enforcement
- [Multi-Entry SPA Architecture](../../frontend/multi-entry-spa-architecture/SKILL.md) — Separate entries for each audience
- [React Context State Management](../../frontend/react-context-state-management/SKILL.md) — Auth context follows the same pattern

## Repository Evidence

- [`src/context/CustomerAuthContext.jsx`](../../src/context/CustomerAuthContext.jsx) — Customer auth context with Supabase listener
- [`src/components/auth/CustomerProtectedRoute.jsx`](../../src/components/auth/CustomerProtectedRoute.jsx) — Session-only guard with redirect
- [`src/components/auth/AdminProtectedRoute.jsx`](../../src/components/auth/AdminProtectedRoute.jsx) — Session + role guard with access denied screen
- [`src/pages/Login.jsx`](../../src/pages/Login.jsx) — Customer Google OAuth login
- [`src/pages/admin/AdminLogin.jsx`](../../src/pages/admin/AdminLogin.jsx) — Admin email/password login
- [`src/pages/AuthCallback.jsx`](../../src/pages/AuthCallback.jsx) — OAuth callback with safety timeout
- [`src/lib/supabase.js`](../../src/lib/supabase.js) — Dual Supabase clients (authenticated + public)
- [`src/App.jsx`](../../src/App.jsx) — Public routes with CustomerProtectedRoute
- [`src/admin-main.jsx`](../../src/admin-main.jsx) — Admin routes with AdminProtectedRoute

## Limitations

- The Shivaay project does not implement token refresh error handling (it relies on Supabase's automatic refresh).
- Post-login redirect (`state.from`) is implemented in the customer route but not in the admin route.
- The admin access denied screen exposes debug information that should be removed in a production deployment.
- Rate limiting and account lockout are not implemented at the application level (they may exist at the Supabase/infrastructure level but this was not verified).
- The `publicSupabase` client pattern (session-free for public reads) was introduced as a bug fix (`52379b6`) — it's a legitimate pattern but may not be documented in Supabase best practices.
