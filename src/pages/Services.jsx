import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PackageCheck,
  ShoppingBag,
  Layers,
  Workflow,
  Headphones,
  Handshake,
  Sparkles,
  ArrowRight,
  PhoneCall
} from 'lucide-react';

const services = [
  {
    icon: PackageCheck,
    title: 'Product Supply',
    desc: 'We provide a range of products designed to meet the regular requirements of businesses and organizations. Our focus is on practical products, consistent quality, and dependable supply.',
    accent: 'text-[#16A34A]',
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#BBF7D0]'
  },
  {
    icon: ShoppingBag,
    title: 'Business Ordering',
    desc: 'Our ordering process is designed to make purchasing simple and convenient. Customers can explore available products, select their requirements, and submit orders with ease.',
    accent: 'text-[#2563EB]',
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#BFDBFE]'
  },
  {
    icon: Layers,
    title: 'Bulk & Business Requirements',
    desc: 'For businesses with larger or recurring requirements, we can coordinate product quantities and order requirements based on their needs.',
    accent: 'text-[#D97706]',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]'
  },
  {
    icon: Workflow,
    title: 'Order Coordination',
    desc: 'From receiving an order to coordinating its fulfilment, we focus on clear communication and smooth processing so customers know what to expect.',
    accent: 'text-[#7C3AED]',
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#DDD6FE]'
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    desc: 'We believe service continues after an order is placed. Our team is available to assist with product-related questions, order coordination, and customer requirements.',
    accent: 'text-[#0284C7]',
    bg: 'bg-[#F0F9FF]',
    border: 'border-[#BAE6FD]'
  },
  {
    icon: Handshake,
    title: 'Reliable Business Partnership',
    desc: 'Beyond individual orders, our aim is to build long-term relationships with businesses through consistent service, dependable communication, and an understanding of their ongoing requirements.',
    accent: 'text-[#DC2626]',
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#FECACA]'
  }
];

const Services = () => {
  return (
    <section className="w-full bg-[#F8FAFC] min-h-[calc(100vh-72px)] py-10 sm:py-14 md:py-20 px-4 sm:px-5 md:px-6">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-12 sm:gap-16 md:gap-20">
        
        {/* ─── Hero Section ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-[840px] mx-auto text-center"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[12px] font-bold tracking-wider uppercase mb-4">
            <Sparkles size={13} />
            <span>Our Services</span>
          </div>

          <h1 className="text-[32px] sm:text-[42px] md:text-[50px] font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-6">
            Making Business Procurement Simpler
          </h1>

          <p className="text-[16px] sm:text-[18px] text-[#475569] leading-relaxed max-w-[760px] mx-auto">
            Shivaay Enterprise provides a straightforward approach to sourcing and ordering products for businesses. We combine product availability, convenient ordering, and customer support to make procurement easier.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
            <Link to="/products" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-7 h-[48px] rounded-[12px] bg-[#0F172A] text-[#FFFFFF] text-[15px] font-bold hover:bg-[#1E293B] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-7 h-[48px] rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] font-bold hover:bg-[#F1F5F9] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall size={16} />
                <span>Contact Our Team</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* ─── Services Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map(({ icon: Icon, title, desc, accent, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="bg-[#FFFFFF] rounded-[16px] border border-[#E2E8F0] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-[12px] ${bg} border ${border} flex items-center justify-center mb-5`}>
                  <Icon size={24} className={accent} />
                </div>
                <h2 className="text-[18px] sm:text-[19px] font-bold text-[#0F172A] mb-2.5">
                  {title}
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#64748B] leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Bottom CTA Banner ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative rounded-[20px] sm:rounded-[24px] bg-[#0F172A] text-white p-7 sm:p-10 md:p-12 overflow-hidden shadow-md"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-[760px] mx-auto text-center flex flex-col items-center gap-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFFFFF]/10 border border-[#FFFFFF]/15 text-[11px] sm:text-[12px] font-bold tracking-widest uppercase text-white/90">
              Procurement Solutions
            </span>

            <h3 className="text-[24px] sm:text-[30px] md:text-[34px] font-heading font-extrabold text-white leading-snug tracking-tight">
              Need a Business Supply Solution?
            </h3>

            <p className="text-[15px] sm:text-[16px] text-[#94A3B8] max-w-xl leading-relaxed">
              Tell us what your business needs, and let Shivaay Enterprise help you find a practical and reliable way to fulfil those requirements.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link to="/contact">
                <button
                  type="button"
                  className="px-6 h-[46px] rounded-[12px] bg-[#DC2626] text-white text-[14px] font-bold hover:bg-[#b91c1c] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall size={16} />
                  <span>Contact Shivaay Enterprise</span>
                </button>
              </Link>
              <Link to="/products">
                <button
                  type="button"
                  className="px-6 h-[46px] rounded-[12px] bg-white/10 hover:bg-white/15 border border-white/20 text-white text-[14px] font-bold active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Catalogue</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
