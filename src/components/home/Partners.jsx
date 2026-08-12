import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { partnerBrands } from '../../constants/partners';
import { Building2 } from 'lucide-react';

const PartnerCard = ({ partner, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-[#E5E7EB] p-6 flex flex-col items-center justify-center transition-all duration-300 group"
    >
      <div className="h-24 w-full flex items-center justify-center mb-4 p-2 relative">
        {/* Placeholder / Fallback */}
        {imgError || !partner.image ? (
          <div className="flex flex-col items-center justify-center text-[#6B7280] opacity-50">
            <Building2 size={32} className="mb-2" />
            <span className="text-xs uppercase tracking-wider text-center">{partner.name}</span>
          </div>
        ) : (
          <img
            src={partner.image}
            alt={`${partner.name} logo`}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="text-[#111827] font-semibold text-center text-sm md:text-base">
        {partner.name}
      </h3>
    </motion.div>
  );
};

const Partners = () => {
  return (
    <section className="py-14 md:py-18 lg:py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block text-[#DC2626] text-sm md:text-base font-bold tracking-wider uppercase mb-3">
              Partners
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-[36px] lg:text-[44px] font-bold text-[#111827] leading-tight mb-4"
          >
            Brands We Work With
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto"
          >
            We work with trusted FMCG and beverage brands to bring quality products to businesses across our region.
          </motion.p>
        </div>

        {/* Partner Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {partnerBrands.map((partner, index) => (
            <PartnerCard key={partner.name} partner={partner} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
