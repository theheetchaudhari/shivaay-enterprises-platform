import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const ctaContent = {
  eyebrow: "LET'S GROW TOGETHER",
  heading: "Ready to Grow Your Business?",
  description: "Partner with Shivaay Enterprises for quality FMCG and beverage products at competitive wholesale prices. Let's build a reliable supply relationship for your business.",
  primaryButton: {
    text: "Get Started Today",
    path: "/register"
  },
  secondaryButton: {
    text: "Contact Us",
    path: "/contact"
  }
};

const WholeCTA = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-[#0F172A] relative overflow-hidden flex justify-center">
      {/* Subtle background detail */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-[#1E293B] rounded-full blur-[100px] md:blur-[120px] opacity-40 md:opacity-30"></div>
      </div>
      
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-5 lg:px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-block text-[#DC2626] text-sm md:text-base font-bold tracking-[0.15em] uppercase mb-4 md:mb-5"
        >
          {ctaContent.eyebrow}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl md:text-[40px] lg:text-[52px] font-heading font-bold text-[#FFFFFF] leading-[1.15] mb-6 max-w-3xl"
        >
          {ctaContent.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-[#94A3B8] text-base md:text-[18px] max-w-2xl mx-auto mb-10 md:mb-12 leading-[1.6]"
        >
          {ctaContent.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto justify-center items-center"
        >
          <NavLink to={ctaContent.primaryButton.path} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 h-[48px] md:h-[52px] rounded-[12px] bg-[#DC2626] text-[#FFFFFF] text-[16px] font-semibold hover:bg-[#b91c1c] transition-all shadow-sm hover:shadow-md flex items-center justify-center">
              {ctaContent.primaryButton.text}
            </button>
          </NavLink>
          
          <NavLink to={ctaContent.secondaryButton.path} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 h-[48px] md:h-[52px] rounded-[12px] bg-transparent border border-[#334155] text-[#FFFFFF] text-[16px] font-semibold hover:bg-[#1E293B] hover:border-[#475569] transition-all flex items-center justify-center">
              {ctaContent.secondaryButton.text}
            </button>
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default WholeCTA;
