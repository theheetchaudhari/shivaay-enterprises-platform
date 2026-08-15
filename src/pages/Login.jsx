import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
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

          {/* Coming Soon Notice */}
          <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-[14px] p-4 mb-6 text-center">
            <p className="text-[13px] font-semibold text-[#C2410C] mb-0.5">
              Coming Soon
            </p>
            <p className="text-[12px] text-[#92400E] leading-relaxed">
              Customer accounts are being set up. Contact us directly to place orders.
            </p>
          </div>

          {/* Email Field — Disabled for now */}
          <div className="flex flex-col gap-4 mb-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-[13px] font-semibold text-[#0F172A] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                disabled
                className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#94A3B8] placeholder-[#CBD5E1] px-4 outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-[13px] font-semibold text-[#0F172A] mb-1.5"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                disabled
                className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#94A3B8] placeholder-[#CBD5E1] px-4 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Sign In Button — Disabled */}
          <button
            type="button"
            disabled
            className="w-full h-[46px] rounded-[12px] bg-[#E2E8F0] text-[#94A3B8] text-[15px] font-semibold mb-4 cursor-not-allowed"
          >
            Sign In
          </button>

          {/* Contact Alternatives */}
          <div className="pt-4 border-t border-[#F1F5F9] space-y-2">
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
              <span className="text-[13px] font-semibold text-[#0F172A] flex-1">
                WhatsApp Us
              </span>
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
