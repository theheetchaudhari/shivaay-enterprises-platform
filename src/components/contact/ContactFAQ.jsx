import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 'faq-1',
    question: 'How can I place an order?',
    answer:
      'You can contact us directly by phone or WhatsApp and share the products and quantities you require. Our team will assist you with availability and pricing.',
  },
  {
    id: 'faq-2',
    question: 'Do you accept wholesale orders?',
    answer:
      'Yes. We cater to wholesale and bulk requirements. Contact us with your requirements to discuss product availability and pricing.',
  },
  {
    id: 'faq-3',
    question: 'How can I get product pricing?',
    answer:
      'Contact us by phone or WhatsApp with the products and quantities you need, and our team will provide the relevant pricing.',
  },
  {
    id: 'faq-4',
    question: 'Where are you located?',
    answer:
      'We are located at New Mangaldeep Society A-326, Rajpipla Rd, Udhyagnagar, Hifazat Nagar, Ankleshwar, Bharuch, Gujarat - 393010, India.',
  },
  {
    id: 'faq-5',
    question: 'What are your working hours?',
    answer:
      'We are open Monday to Sunday, from 7:00 AM to 10:00 AM.',
  },
];

const ContactFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-5 md:px-6">
      <div className="max-w-[780px] w-full mx-auto">
        {/* Minimalist Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 text-[#DC2626] text-[12px] font-bold tracking-[0.14em] uppercase mb-2"
          >
            <HelpCircle size={13} />
            <span>FAQ</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-[26px] sm:text-[32px] md:text-[36px] font-heading font-extrabold text-[#0F172A] tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-[14px] sm:text-[15px] text-[#64748B] mt-1.5 max-w-md mx-auto"
          >
            Quick answers about ordering, wholesale supply, and working hours.
          </motion.p>
        </div>

        {/* Minimalist Accordion List (Card Container retained only for FAQ) */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`rounded-[14px] border transition-all duration-200 overflow-hidden ${isOpen
                    ? 'bg-[#FFFFFF] border-[#CBD5E1] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                    : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] rounded-[14px] cursor-pointer"
                >
                  <span className="text-[15px] sm:text-[16px] font-semibold text-[#0F172A] leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-250 ${isOpen
                        ? 'bg-[#FEF2F2] text-[#DC2626] rotate-180'
                        : 'bg-[#F8FAFC] text-[#64748B]'
                      }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.2, delay: 0.05 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.1 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4.5 sm:px-6 sm:pb-5 pt-0 border-t border-[#F8FAFC]">
                        <p className="text-[14px] text-[#475569] leading-relaxed pt-2.5 font-normal">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
