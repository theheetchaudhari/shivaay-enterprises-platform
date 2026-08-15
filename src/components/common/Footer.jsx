import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

// --- Editable Footer Data ---

const GOOGLE_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4196.517149492455!2d73.03427529999999!3d21.6337032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be023d67e697f5b%3A0x68d57c0a70000000!2sSHIVAAY%20ENTERPRISES!5e1!3m2!1sen!2sin!4v1786277787051!5m2!1sen!2sin';

const footerData = {
  brand: {
    tagline:
      'Your trusted wholesale distribution partner for soft drinks, beverages, FMCG products, and general store supplies.',
    values: ['Purity', 'Quality', 'Trust'],
  },
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Services', path: '/services' },
    { label: 'Our Products', path: '/products' },
    { label: 'Contact Us', path: '/contact' },
  ],
  services: [
    'Wholesale Supply',
    'Retail Distribution',
    'Restaurant Supply',
    'Bulk Orders',
    'Corporate Supply',
  ],
  contact: {
    phones: ['+91 9408915910', '+91 9081936116'],
    email: 'shivaayenterprises.orders@gmail.com',
    address:
      'New Mangaldeep Society A-326, Rajiprl Rd, Udhyagnagar, Hifazat Nagar, Ankleshwar, Bharuch, Gujarat',
  },
};

// --- Animation Helper ---

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay },
});

// --- Section Heading ---

const FooterHeading = ({ children }) => (
  <h3 className="text-[#FFFFFF] text-[15px] font-bold uppercase tracking-[0.12em] mb-6 relative pb-3">
    {children}
    <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-[#DC2626] rounded-full" />
  </h3>
);

// --- Brand Column ---

const BrandColumn = () => (
  <motion.div {...fadeUp(0)} className="flex flex-col gap-5">
    <NavLink to="/" className="inline-block w-fit">
      <img
        src="/logo-white-text.png"
        alt="Shivaay Enterprises"
        className="h-12 object-contain"
      />
    </NavLink>

    <p className="text-[#94A3B8] text-[15px] leading-[1.75] max-w-[280px]">
      {footerData.brand.tagline}
    </p>

    <div className="flex items-center gap-2 flex-wrap">
      {footerData.brand.values.map((value, i) => (
        <React.Fragment key={value}>
          <span className="text-[#CBD5E1] text-[13px] font-semibold tracking-wide">
            {value}
          </span>
          {i < footerData.brand.values.length - 1 && (
            <span className="text-[#DC2626] text-[13px] select-none">•</span>
          )}
        </React.Fragment>
      ))}
    </div>
  </motion.div>
);

// --- Company Column ---

const CompanyColumn = () => (
  <motion.div {...fadeUp(0.08)}>
    <FooterHeading>Company</FooterHeading>
    <ul className="flex flex-col gap-[10px]">
      {footerData.company.map(({ label, path }) => (
        <li key={label}>
          <NavLink
            to={path}
            className="text-[#94A3B8] text-[15px] hover:text-[#DC2626] transition-colors duration-200 leading-[1.5]"
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </motion.div>
);

// --- Services Column ---

const ServicesColumn = () => (
  <motion.div {...fadeUp(0.14)}>
    <FooterHeading>Services</FooterHeading>
    <ul className="flex flex-col gap-[10px]">
      {footerData.services.map((service) => (
        <li key={service} className="text-[#94A3B8] text-[15px] leading-[1.5]">
          {service}
        </li>
      ))}
    </ul>
  </motion.div>
);

// --- Contact + Map Column ---

const ContactColumn = () => {
  const { phones, email, address } = footerData.contact;

  return (
    <motion.div {...fadeUp(0.2)} className="flex flex-col gap-5">
      <FooterHeading>Contact Us</FooterHeading>

      <div className="flex flex-col gap-2">
        {phones.map((phone) => (
          <a
            key={phone}
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-3 text-[#94A3B8] text-[15px] hover:text-[#DC2626] transition-colors duration-200 group"
          >
            <Phone
              size={16}
              className="text-[#DC2626] shrink-0 group-hover:scale-110 transition-transform duration-200"
            />
            {phone}
          </a>
        ))}
      </div>

      <a
        href={`mailto:${email}`}
        className="flex items-start gap-3 text-[#94A3B8] text-[15px] hover:text-[#DC2626] transition-colors duration-200 group"
      >
        <Mail
          size={16}
          className="text-[#DC2626] shrink-0 mt-[2px] group-hover:scale-110 transition-transform duration-200"
        />
        <span className="break-all">{email}</span>
      </a>

      <div className="flex items-start gap-3">
        <MapPin size={16} className="text-[#DC2626] shrink-0 mt-[2px]" />
        <p className="text-[#94A3B8] text-[15px] leading-[1.65]">{address}</p>
      </div>

      <div
        className="w-full rounded-[12px] overflow-hidden border border-[#1E293B] shadow-sm"
        style={{ aspectRatio: '16/9', minHeight: '180px' }}
      >
        <iframe
          src={GOOGLE_MAPS_EMBED_URL}
          title="Shivaay Enterprises location"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </motion.div>
  );
};

// --- Bottom Bar ---

const BottomBar = () => (
  <motion.div
    {...fadeUp(0.28)}
    className="mt-12 pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row justify-between items-center gap-3 text-[13px] text-[#475569]"
  >
    <p>© {new Date().getFullYear()} Shivaay Enterprises. All rights reserved.</p>
    <p className="text-center sm:text-right">Ankleshwar, Bharuch, Gujarat, India</p>
  </motion.div>
);

// --- Footer ---

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-5 lg:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.8fr] gap-10 md:gap-12 lg:gap-8">
          <BrandColumn />
          <CompanyColumn />
          <ServicesColumn />
          <ContactColumn />
        </div>
        <BottomBar />
      </div>
    </footer>
  );
};

export default Footer;
