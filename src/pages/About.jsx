import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Package, Truck, HeartHandshake } from 'lucide-react';

const About = () => {
  return (
    <section className="w-full bg-[#F8FAFC] min-h-[calc(100vh-72px)] py-14 px-4 sm:px-5 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-[760px] mx-auto text-center"
        >
          <p className="text-[12px] font-bold tracking-[0.14em] text-[#DC2626] uppercase mb-3">
            About Us
          </p>
          <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-5">
            Shivaay Enterprise
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] leading-relaxed mb-8">
            Your trusted wholesale distribution partner for soft drinks, beverages,
            FMCG products, and general store supplies in Ankleshwar and across Gujarat.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products">
              <button
                type="button"
                className="px-7 h-[46px] rounded-[12px] bg-[#DC2626] text-[#FFFFFF] text-[15px] font-semibold hover:bg-[#b91c1c] transition-all shadow-sm cursor-pointer"
              >
                Browse Products
              </button>
            </Link>
            <Link to="/contact">
              <button
                type="button"
                className="px-7 h-[46px] rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] font-semibold hover:bg-[#F8FAFC] transition-all shadow-sm cursor-pointer"
              >
                Contact Us
              </button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
          {[
            { icon: ShieldCheck, title: 'Best Quality', desc: '100% original, verified products from authorised brand partners.', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: Package, title: 'Wholesale Pricing', desc: 'All products available at highly competitive wholesale rates.', color: 'text-[#16A34A]', bg: 'bg-green-50' },
            { icon: Truck, title: 'Wide Availability', desc: 'Fast delivery across our growing distribution network.', color: 'text-[#F59E0B]', bg: 'bg-amber-50' },
            { icon: HeartHandshake, title: 'Customer First', desc: 'We believe in happy customers, reliable service, and long-term trust.', color: 'text-[#DC2626]', bg: 'bg-red-50' },
          ].map(({ icon: Icon, title, desc, color, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="bg-[#FFFFFF] rounded-[16px] border border-[#E2E8F0] p-6 text-center"
            >
              <div className={`w-12 h-12 rounded-[12px] ${bg} flex items-center justify-center mx-auto mb-4`}>
                <Icon size={24} className={color} />
              </div>
              <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">{title}</h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
