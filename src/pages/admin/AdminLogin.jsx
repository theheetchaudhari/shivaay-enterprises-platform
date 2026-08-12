import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message || 'Login failed. Please check your credentials.');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #ffffff 2px, transparent 0)',
          backgroundSize: '50px 50px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-[440px]"
      >
        {/* Card */}
        <div className="bg-[#FFFFFF] rounded-[24px] shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#0F172A] px-8 py-8 flex flex-col items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="flex items-center justify-center w-14 h-14 rounded-[16px] bg-white/10 border border-white/20"
            >
              <ShieldCheck size={28} className="text-[#DC2626]" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-[22px] font-bold text-[#FFFFFF] leading-tight">
                Admin Portal
              </h1>
              <p className="text-[14px] text-[#94a3b8] mt-1">
                Shivaay Enterprises — Restricted Access
              </p>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-8 py-8">
            <form onSubmit={handleLogin} id="admin-login-form" noValidate>
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-6 flex items-start gap-3 px-4 py-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[12px]"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle size={18} className="text-[#DC2626] mt-0.5 shrink-0" />
                  <p className="text-[14px] text-[#DC2626] font-medium leading-snug">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Email Field */}
              <div className="mb-5">
                <label
                  htmlFor="admin-email"
                  className="block text-[14px] font-semibold text-[#374151] mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-[#9CA3AF]" />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="admin@shivaayenterprises.com"
                    className="w-full h-[52px] pl-11 pr-4 rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] text-[16px] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-8">
                <label
                  htmlFor="admin-password"
                  className="block text-[14px] font-semibold text-[#374151] mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-[#9CA3AF]" />
                  </div>
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your password"
                    className="w-full h-[52px] pl-11 pr-4 rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] text-[16px] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                id="admin-login-submit"
                type="submit"
                disabled={loading}
                whileHover={!loading ? { y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full h-[52px] flex items-center justify-center gap-2 rounded-[12px] bg-[#0F172A] text-[#FFFFFF] text-[16px] font-semibold hover:bg-[#1e293b] transition-all shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  'Login'
                )}
              </motion.button>
            </form>

            {/* Footer note */}
            <p className="mt-6 text-center text-[13px] text-[#9CA3AF]">
              This page is restricted to authorised personnel only.
            </p>
          </div>
        </div>

        {/* Brand mark below card */}
        <p className="mt-6 text-center text-[13px] text-[#475569]">
          © {new Date().getFullYear()} Shivaay Enterprises
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
