import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay },
});

const TermsConditions = () => (
  <motion.main {...fadeUp(0)} className="max-w-[1280px] mx-auto px-4 md:px-5 lg:px-6 py-12">
    <h1 className="text-4xl font-bold text-[#111827] mb-6">Terms &amp; Conditions</h1>
    <p className="text-[#475569] leading-relaxed">
      This is the Terms &amp; Conditions page. Detailed terms and conditions will be provided here.
    </p>
  </motion.main>
);

export default TermsConditions;
