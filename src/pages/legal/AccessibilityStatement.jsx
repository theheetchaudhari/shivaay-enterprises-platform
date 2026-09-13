import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay },
});

const AccessibilityStatement = () => (
  <motion.main {...fadeUp(0)} className="max-w-[1280px] mx-auto px-4 md:px-5 lg:px-6 py-12">
    <h1 className="text-4xl font-bold text-[#111827] mb-6">Accessibility Statement</h1>
    <p className="text-[#475569] leading-relaxed">
      This page outlines our commitment to accessibility and provides details on how we ensure our website is usable by everyone.
    </p>
  </motion.main>
);

export default AccessibilityStatement;
