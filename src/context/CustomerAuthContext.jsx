import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// ─── Context ──────────────────────────────────────────────────────────────────
const CustomerAuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CustomerAuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still loading, null = signed out
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Seed current session on mount (avoids a flash on initial page load)
    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current ?? null);
      setLoading(false);
    });

    // 2. Subscribe to all subsequent auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Customer sign-out — never touches public.profiles or any admin route
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/');
  }, [navigate]);

  // Derived: the raw Supabase user object (or null)
  const user = session?.user ?? null;

  return (
    <CustomerAuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error('useCustomerAuth must be used inside <CustomerAuthProvider>');
  }
  return ctx;
}
