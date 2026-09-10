import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * AuthCallback — rendered at /auth/callback
 *
 * Supabase redirects here after Google OAuth. For the local Supabase implicit
 * flow the session token arrives in the URL hash; supabase-js with
 * detectSessionInUrl: true (the default) automatically exchanges it.
 *
 * We simply wait for onAuthStateChange to fire with a valid session, then
 * redirect the customer to the public storefront home page.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // The Supabase client automatically processes the URL hash / code param.
    // We listen for the resulting session event and then navigate away.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Successfully authenticated — go to the storefront
        subscription.unsubscribe();
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        subscription.unsubscribe();
        navigate('/login', { replace: true });
      }
    });

    // Safety net: if no auth event fires within 8 seconds, something went wrong
    const timeout = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session }, error: err }) => {
        if (session) {
          navigate('/', { replace: true });
        } else {
          setError(
            err?.message ||
              'Authentication could not be completed. The link may have expired or the OAuth provider is not yet configured. Please try again.'
          );
        }
      });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[400px] bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FEF2F2] mb-5">
            <AlertCircle size={28} className="text-[#DC2626]" />
          </div>
          <h1 className="text-[20px] font-heading font-bold text-[#0F172A] mb-2">
            Sign-in Failed
          </h1>
          <p className="text-[14px] text-[#64748B] leading-relaxed mb-6">{error}</p>
          <button
            id="auth-callback-retry"
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            className="w-full h-[46px] rounded-[12px] bg-[#0F172A] text-white text-[15px] font-semibold hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            Back to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      >
        <Loader2 size={36} className="text-[#0F172A]" />
      </motion.div>
      <p className="text-[14px] font-semibold text-[#64748B]">Completing sign-in…</p>
    </div>
  );
};

export default AuthCallback;
