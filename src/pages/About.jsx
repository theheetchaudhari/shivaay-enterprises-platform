import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ClockCheck,
  Users,
  Handshake,
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';

const beliefs = [
  {
    icon: ShieldCheck,
    title: 'Quality First',
    desc: 'We focus on offering products that meet practical business requirements and maintain consistent standards.',
    accent: 'text-[#16A34A]',
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#BBF7D0]'
  },
  {
    icon: ClockCheck,
    title: 'Reliable Service',
    desc: 'We value clear communication, timely coordination, and dependable support throughout the ordering process.',
    accent: 'text-[#2563EB]',
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#BFDBFE]'
  },
  {
    icon: Users,
    title: 'Customer Focus',
    desc: 'Every business has different requirements. We aim to understand those needs and provide solutions accordingly.',
    accent: 'text-[#D97706]',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]'
  },
  {
    icon: Handshake,
    title: 'Long-Term Relationships',
    desc: 'We believe successful business relationships are built through trust, consistency, and service—not just individual transactions.',
    accent: 'text-[#DC2626]',
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#FECACA]'
  }
];

const About = () => {
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
            <span>About Shivaay Enterprise</span>
          </div>

          <h1 className="text-[32px] sm:text-[42px] md:text-[50px] font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-6">
            Reliable Products. Practical Solutions. Trusted Service.
          </h1>

          <div className="flex flex-col gap-4 text-[15px] sm:text-[17px] text-[#475569] leading-relaxed max-w-[760px] mx-auto">
            <p>
              Shivaay Enterprise is a business-focused supplier committed to providing quality products and dependable service for everyday business and operational needs.
            </p>
            <p>
              We believe that sourcing products should be simple, transparent, and reliable. Our goal is to make it easier for businesses to discover the products they need, place orders conveniently, and build a dependable long-term supply relationship.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[#64748B]">
              From product selection to order coordination, we focus on delivering a smooth experience backed by responsive support and consistent service.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
            <Link to="/products" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-7 h-[48px] rounded-[12px] bg-[#0F172A] text-[#FFFFFF] text-[15px] font-bold hover:bg-[#1E293B] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Catalogue</span>
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-7 h-[48px] rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] font-bold hover:bg-[#F1F5F9] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall size={16} />
                <span>Get in Touch</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* ─── What We Believe Grid ────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-[26px] sm:text-[32px] font-heading font-extrabold text-[#0F172A] tracking-tight">
              What We Believe
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#64748B] mt-1.5">
              The core principles guiding every relationship, order, and solution we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {beliefs.map(({ icon: Icon, title, desc, accent, bg, border }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="bg-[#FFFFFF] rounded-[16px] border border-[#E2E8F0] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-[12px] ${bg} border ${border} flex items-center justify-center mb-5`}>
                    <Icon size={24} className={accent} />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-2.5">
                    {title}
                  </h3>
                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Our Goal Banner ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative rounded-[20px] sm:rounded-[24px] bg-[#0F172A] text-white p-7 sm:p-10 md:p-12 overflow-hidden shadow-md"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-[800px] mx-auto text-center flex flex-col items-center gap-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFFFFF]/10 border border-[#FFFFFF]/15 text-[11px] sm:text-[12px] font-bold tracking-widest uppercase text-white/90">
              Our Goal
            </span>

            <p className="text-[20px] sm:text-[24px] md:text-[28px] font-bold text-white leading-snug tracking-tight">
              &ldquo;To become a trusted business partner for our customers by combining quality products, convenient ordering, responsive service, and reliable supply.&rdquo;
            </p>

            <p className="text-[15px] sm:text-[16px] text-[#94A3B8] max-w-xl">
              At Shivaay Enterprise, we are focused on building relationships that grow with our customers.
            </p>

            <div className="pt-2">
              <Link to="/products">
                <button
                  type="button"
                  className="px-6 h-[44px] rounded-[12px] bg-[#DC2626] text-white text-[14px] font-bold hover:bg-[#b91c1c] active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Products</span>
                  <ArrowRight size={15} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
