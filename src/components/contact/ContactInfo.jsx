import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Check, Copy } from 'lucide-react';

const contactDetails = [
  {
    id: 'phone',
    icon: Phone,
    title: 'Phone',
    content: '+91 9408915910 / 9081936116',
    subtext: 'Direct phone lines for rapid wholesale orders',
    numbers: [
      { label: '+91 9408915910', href: 'tel:+919408915910', raw: '+919408915910' },
      { label: '+91 9081936116', href: 'tel:+919081936116', raw: '+919081936116' },
    ],
    primaryAction: {
      label: 'Call Primary',
      href: 'tel:+919408915910',
    },
  },
  {
    id: 'email',
    icon: Mail,
    title: 'Email',
    content: 'shivaayenterprises.orders@gmail.com',
    subtext: 'Email for formal quotations and inquiries',
    email: 'shivaayenterprises.orders@gmail.com',
    primaryAction: {
      label: 'Write Email',
      href: 'mailto:shivaayenterprises.orders@gmail.com',
    },
  },
  {
    id: 'address',
    icon: MapPin,
    title: 'Address',
    content: 'New Mangaldeep Society A-326, Rajpipla Rd, Udhyagnagar, Hifazat Nagar, Ankleshwar, Bharuch, Gujarat - 393002, India',
    subtext: 'Ankleshwar, Gujarat, India',
    primaryAction: {
      label: 'Open in Maps',
      href: 'https://www.google.com/maps/search/?api=1&query=New+Mangaldeep+Society+A-326%2C+Rajpipla+Rd%2C+Udhyagnagar%2C+Hifazat+Nagar%2C+Ankleshwar%2C+Bharuch%2C+Gujarat+-+393002%2C+India',
      isExternal: true,
    },
  },
  {
    id: 'hours',
    icon: Clock,
    title: 'Working Hours',
    content: 'Monday – Sunday',
    time: '7:00 AM – 10:00 PM',
    subtext: 'Open 7 days a week',
    badge: '7 Days a Week',
  },
];

const ContactInfo = () => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-5 md:px-6">
      <div className="max-w-[1280px] w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {contactDetails.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icon & Action/Badge (Clean & Open) */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-[10px] bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
                      <Icon size={19} />
                    </div>

                    {item.badge ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[#16A34A] text-[11px] font-semibold tracking-wide">
                        {item.badge}
                      </span>
                    ) : item.id === 'phone' ? (
                      <button
                        type="button"
                        onClick={() => handleCopy('phone', '+91 9408915910')}
                        className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A] transition-all text-[12px] flex items-center gap-1 cursor-pointer"
                        title="Copy Primary Number"
                        aria-label="Copy primary phone number"
                      >
                        {copiedId === 'phone' ? (
                          <span className="text-[#16A34A] flex items-center gap-1 text-[11px] font-semibold">
                            <Check size={13} /> Copied
                          </span>
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    ) : item.id === 'email' ? (
                      <button
                        type="button"
                        onClick={() => handleCopy('email', item.email)}
                        className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A] transition-all text-[12px] flex items-center gap-1 cursor-pointer"
                        title="Copy Email"
                        aria-label="Copy email address"
                      >
                        {copiedId === 'email' ? (
                          <span className="text-[#16A34A] flex items-center gap-1 text-[11px] font-semibold">
                            <Check size={13} /> Copied
                          </span>
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    ) : null}
                  </div>

                  {/* Title */}
                  <h2 className="text-[17px] font-bold text-[#0F172A] mb-2 tracking-tight">
                    {item.title}
                  </h2>

                  {/* Content */}
                  {item.id === 'phone' ? (
                    <div className="flex flex-col gap-1 mb-2">
                      <a
                        href={item.numbers[0].href}
                        className="text-[15px] font-semibold text-[#0F172A] hover:text-[#DC2626] transition-colors"
                      >
                        {item.numbers[0].label}
                      </a>
                      <a
                        href={item.numbers[1].href}
                        className="text-[14px] font-medium text-[#475569] hover:text-[#DC2626] transition-colors"
                      >
                        {item.numbers[1].label}
                      </a>
                    </div>
                  ) : item.id === 'email' ? (
                    <a
                      href={item.primaryAction.href}
                      className="block text-[14px] sm:text-[15px] font-medium text-[#0F172A] hover:text-[#DC2626] transition-colors break-all mb-2 leading-snug"
                    >
                      {item.content}
                    </a>
                  ) : item.id === 'address' ? (
                    <p className="text-[13px] sm:text-[14px] text-[#334155] leading-relaxed mb-2 font-normal">
                      {item.content}
                    </p>
                  ) : (
                    <div className="mb-2">
                      <p className="text-[15px] font-semibold text-[#0F172A]">
                        {item.content}
                      </p>
                      <p className="text-[14px] font-bold text-[#DC2626] mt-0.5">
                        {item.time}
                      </p>
                    </div>
                  )}

                  {/* Subtext */}
                  <p className="text-[12px] text-[#64748B] leading-normal font-normal">
                    {item.subtext}
                  </p>
                </div>

                {/* Direct Action Link */}
                {item.primaryAction && (
                  <div className="mt-4 pt-2">
                    <a
                      href={item.primaryAction.href}
                      target={item.primaryAction.isExternal ? '_blank' : undefined}
                      rel={item.primaryAction.isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#DC2626] hover:text-[#b91c1c] transition-colors group"
                    >
                      <span>{item.primaryAction.label}</span>
                      <ArrowUpRight
                        size={14}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
