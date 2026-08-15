import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';

const ContactCTA = () => {
  return (
    <section className="w-full bg-[#0F172A] py-16 md:py-24 px-4 sm:px-5 md:px-6 relative overflow-hidden border-y border-[#1E293B]">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[#1E293B] rounded-full blur-[120px] opacity-35" />
      </div>

      <div className="max-w-[1280px] w-full mx-auto relative z-10 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="inline-block text-[#DC2626] text-[12px] md:text-[13px] font-bold tracking-[0.15em] uppercase mb-3"
        >
          Direct Assistance
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.06 }}
          className="text-[28px] sm:text-[36px] md:text-[42px] font-heading font-bold text-[#FFFFFF] leading-[1.18] mb-3.5 tracking-tight max-w-2xl"
        >
          Need Help With Your Order?
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.12 }}
          className="text-[#94A3B8] text-[15px] sm:text-[17px] leading-relaxed mb-8 md:mb-10 max-w-xl font-normal"
        >
          Contact us directly for product availability, wholesale enquiries, and order assistance.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.18 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Call Now Button */}
          <a
            href="tel:+919408915910"
            className="w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 h-[50px] md:h-[52px] rounded-[12px] bg-[#DC2626] text-[#FFFFFF] text-[16px] font-semibold hover:bg-[#b91c1c] transition-all shadow-sm hover:shadow flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </motion.button>
          </a>

          {/* WhatsApp Button with Official WhatsApp Icon */}
          <a
            href="https://wa.me/919408915910"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 h-[50px] md:h-[52px] rounded-[12px] bg-[#25D366] text-[#FFFFFF] text-[16px] font-semibold hover:bg-[#20bd5a] transition-all shadow-sm hover:shadow flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <WhatsAppIcon size={20} className="shrink-0" />
              <span>WhatsApp</span>
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
