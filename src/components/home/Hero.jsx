import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="w-full bg-[#F8FAFC] min-h-[calc(100vh-72px)] py-12 md:py-16 flex flex-col items-center justify-center px-4 sm:px-5 md:px-6">
      <div className="max-w-[1280px] w-full flex flex-col items-center justify-center text-center">
        {/* Logo */}
        <motion.img 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          src="/logo.png" 
          alt="Shivaay Enterprises Logo" 
          className="w-[280px] h-[280px] object-contain mb-[32px] md:mb-[48px]"
        />

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[40px] md:text-[56px] lg:text-[64px] font-bold leading-[1.1] tracking-tight mb-[24px]"
        >
          <span className="block text-[#0F172A]">Quality Products,</span>
          <span className="block text-[#DC2626]">Trusted by All</span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-[16px] md:text-[18px] text-[#6B7280] leading-relaxed max-w-[640px] mx-auto mb-[40px]"
        >
          We provide a wide range of beverages and FMCG products at the best
          price — delivered fast across your region.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-[16px] sm:gap-[24px] w-full sm:w-auto"
        >
          <NavLink to="/products" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-[32px] py-[16px] rounded-[12px] bg-[#DC2626] text-[#FFFFFF] text-[16px] font-semibold hover:bg-[#b91c1c] transition-all shadow-sm hover:shadow"
            >
              Browse Products <ArrowRight size={20} />
            </motion.button>
          </NavLink>
          <NavLink to="/contact" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-[32px] py-[16px] rounded-[12px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] text-[16px] font-semibold hover:bg-[#F1F5F9] transition-all shadow-sm hover:shadow"
            >
              Contact Us
            </motion.button>
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
