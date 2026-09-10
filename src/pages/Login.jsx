import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Loader2, AlertCircle, LogOut, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCustomerAuth } from '../context/CustomerAuthContext';

// ─── Google wordmark SVG (inline, no external deps) ──────────────────────────
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
const Login = () => {
  const { user, loading: authLoading, signOut } = useCustomerAuth();
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setOauthLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) {
        setError(oauthError.message || 'Could not start Google sign-in. Please try again.');
        setOauthLoading(false);
      }
      // On success the browser navigates to Google — no further action needed here.
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setOauthLoading(false);
    }
  };

  // ── Signed-in state ─────────────────────────────────────────────────────────
  if (!authLoading && user) {
    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Customer';
    const avatarUrl = user.user_metadata?.avatar_url || null;

    return (
      <section className="w-full bg-[#F8FAFC] min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-8 text-center"
          >
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-16 h-16 rounded-full border-2 border-[#E2E8F0] object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-[22px] font-bold select-none">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 text-[#16A34A] text-[12px] font-bold tracking-[0.14em] uppercase mb-2">
              <CheckCircle2 size={14} />
              Signed In
            </div>
            <h1 className="text-[22px] font-heading font-extrabold text-[#0F172A] tracking-tight mb-1">
              Welcome, {displayName}
            </h1>
            <p className="text-[14px] text-[#64748B] mb-6">
              You are signed in with{' '}
              <span className="font-semibold text-[#0F172A]">{user.email}</span>.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/products"
                id="login-browse-products"
                className="w-full h-[46px] flex items-center justify-center rounded-[12px] bg-[#0F172A] text-white text-[15px] font-semibold hover:bg-[#1e293b] transition-colors"
              >
                Browse Products
              </Link>
              <button
                id="login-sign-out"
                type="button"
                onClick={signOut}
                className="w-full h-[46px] flex items-center justify-center gap-2 rounded-[12px] border border-[#E2E8F0] bg-white text-[#64748B] text-[15px] font-semibold hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </motion.div>

          <div className="text-center mt-5">
            <Link
              to="/"
              className="text-[13px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Sign-in card ─────────────────────────────────────────────────────────────
  return (
    <section className="w-full bg-[#F8FAFC] min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FFFFFF] rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-8"
        >
          {/* Header */}
          <div className="mb-7 text-center">
            <div className="inline-flex items-center gap-1.5 text-[#DC2626] text-[12px] font-bold tracking-[0.14em] uppercase mb-3">
              Customer Account
            </div>
            <h1 className="text-[26px] font-heading font-extrabold text-[#0F172A] tracking-tight mb-1">
              Sign In
            </h1>
            <p className="text-[14px] text-[#64748B] leading-normal">
              Access your orders and saved cart.
            </p>
          </div>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3 px-4 py-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[12px] mb-5"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={16} className="text-[#DC2626] mt-0.5 shrink-0" />
                <p className="text-[13px] text-[#DC2626] font-medium leading-snug">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign-In Button */}
          <motion.button
            id="login-google-signin"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={oauthLoading || authLoading}
            whileHover={!oauthLoading ? { y: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' } : {}}
            whileTap={!oauthLoading ? { scale: 0.98 } : {}}
            className="w-full h-[52px] flex items-center justify-center gap-3 rounded-[12px] bg-white border border-[#E2E8F0] text-[#0F172A] text-[15px] font-semibold shadow-sm hover:border-[#CBD5E1] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {oauthLoading ? (
              <>
                <Loader2 size={18} className="animate-spin text-[#64748B]" />
                <span className="text-[#64748B]">Redirecting to Google…</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
              </>
            )}
          </motion.button>

          <p className="text-[12px] text-[#94A3B8] text-center mt-4 leading-relaxed">
            By signing in you agree to our terms of service. Your data is never sold or shared with
            third parties.
          </p>

          {/* Contact Alternatives */}
          <div className="pt-5 mt-5 border-t border-[#F1F5F9] space-y-2">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 text-center">
              Place Orders Directly
            </p>
            <a
              href="tel:+919408915910"
              className="flex items-center gap-3 px-4 py-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F1F5F9] transition-all group"
            >
              <Phone size={16} className="text-[#DC2626] shrink-0" />
              <span className="text-[13px] font-semibold text-[#0F172A] flex-1">
                +91 9408915910
              </span>
              <ArrowRight size={14} className="text-[#94A3B8] group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="https://wa.me/919408915910"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F1F5F9] transition-all group"
            >
              <Phone size={16} className="text-[#25D366] shrink-0" />
              <span className="text-[13px] font-semibold text-[#0F172A] flex-1">WhatsApp Us</span>
              <ArrowRight size={14} className="text-[#94A3B8] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Back link */}
        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-[13px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
