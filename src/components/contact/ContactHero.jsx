import React from 'react';
import { motion } from 'framer-motion';

const ContactHero = () => {
  return (
    <section className="w-full bg-[#F8FAFC] pt-16 pb-10 md:pt-24 md:pb-14 flex flex-col items-center justify-center px-4 sm:px-5 md:px-6 border-b border-[#F1F5F9]">
      <div className="max-w-[1280px] w-full flex flex-col items-center justify-center text-center">
        {/* Minimalist Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-5 md:mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
          </span>
          <span className="font-wellfleet text-[#0F172A] text-[14px] md:text-[16px] tracking-wide pt-0.5">
            Direct Support & Enquiries
          </span>
        </motion.div>

        {/* Minimalist Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="text-[38px] sm:text-[48px] md:text-[56px] font-heading font-extrabold text-[#0F172A] leading-[1.12] tracking-tight mb-4 md:mb-5 max-w-3xl"
        >
          Get in <span className="text-[#DC2626]">Touch</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="text-[16px] md:text-[18px] text-[#64748B] leading-relaxed max-w-[620px] mx-auto font-normal"
        >
          Have questions about our products, wholesale orders, or pricing? We're here to help.
        </motion.p>
      </div>
    </section>
  );
};

export default ContactHero;
