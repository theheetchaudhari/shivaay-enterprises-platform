import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Package, Truck, HeartHandshake } from 'lucide-react';

const trustItems = [
  {
    title: "Best Quality",
    description: "100% original, verified products from authorised brand partners.",
    icon: ShieldCheck,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Wholesale Pricing",
    description: "All products available at highly competitive wholesale rates.",
    icon: Package,
    iconBg: "bg-green-50",
    iconColor: "text-[#16A34A]"
  },
  {
    title: "Wide Availability",
    description: "Fast delivery across our growing distribution network.",
    icon: Truck,
    iconBg: "bg-amber-50",
    iconColor: "text-[#F59E0B]"
  },
  {
    title: "Customer First",
    description: "We believe in happy customers, reliable service, and long-term trust.",
    icon: HeartHandshake,
    iconBg: "bg-red-50",
    iconColor: "text-[#DC2626]"
  }
];

const TrustCard = ({ item, index }) => {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow p-6 md:p-8 flex flex-col items-center text-center h-full"
    >
      <div className={`w-14 h-14 rounded-[12px] flex items-center justify-center mb-6 ${item.iconBg} ${item.iconColor}`}>
        <Icon size={28} strokeWidth={2} />
      </div>
      <h3 className="text-[20px] md:text-[22px] font-semibold text-[#0F172A] mb-3">
        {item.title}
      </h3>
      <p className="text-[15px] md:text-[16px] text-[#6B7280] leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );
};

const TrustSection = () => {
  return (
    <section className="w-full bg-[#FFFFFF] py-[56px] md:py-[72px] lg:py-[96px] px-4 sm:px-5 md:px-6">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col items-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-[#DC2626] text-[14px] font-bold uppercase tracking-widest mb-4"
        >
          OUR PROMISE
        </motion.span>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1 }}
          className="text-[32px] md:text-[36px] lg:text-[44px] font-heading font-bold text-[#0F172A] mb-6 text-center leading-tight"
        >
          Why Choose Us
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2 }}
          className="text-[16px] md:text-[18px] text-[#6B7280] max-w-[640px] text-center leading-relaxed mb-12 md:mb-16"
        >
          We don't just deliver products — we deliver reliability, consistency, and growth
          to your business.
        </motion.p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
          {trustItems.map((item, index) => (
            <TrustCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
