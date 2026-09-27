import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ArrowUpRight } from 'lucide-react';

const GOOGLE_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4196.517149492455!2d73.03427529999999!3d21.6337032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be023d67e697f5b%3A0x68d57c0a70000000!2sSHIVAAY%20ENTERPRISES!5e0!3m2!1sen!2sin!4v1786277787051!5m2!1sen!2sin';

const GOOGLE_MAPS_EXTERNAL_URL =
  'https://www.google.com/maps/place/SHIVAAY+ENTERPRISES/@21.6337032,73.0342753,17z/data=!3m1!4b1!4m6!3m5!1s0x3be023d67e697f5b:0x68d57c0a70000000!8m2!3d21.6337032!4d73.0342753!16s%2Fg%2F11w7v8r_90';

const ADDRESS_TEXT =
  'New Mangaldeep Society A-326, Rajpipla Rd, Udhyagnagar, Hifazat Nagar, Ankleshwar, Bharuch, Gujarat - 393002, India';

const ContactMap = () => {
  return (
    <section className="w-full py-10 md:py-16 px-4 sm:px-5 md:px-6">
      <div className="max-w-[1280px] w-full mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-1.5 text-[#DC2626] text-[12px] font-bold tracking-[0.14em] uppercase mb-2"
            >
              <Navigation size={13} />
              <span>Location</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-[28px] sm:text-[32px] md:text-[36px] font-heading font-extrabold text-[#0F172A] tracking-tight"
            >
              Find Us
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-[14px] sm:text-[15px] text-[#64748B] mt-1"
            >
              Visit Shivaay Enterprise at our Ankleshwar location.
            </motion.p>
          </div>

          <motion.a
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 }}
            href={GOOGLE_MAPS_EXTERNAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#DC2626] text-[14px] font-semibold hover:text-[#b91c1c] transition-colors w-fit group"
          >
            <span>Open in Google Maps</span>
            <ArrowUpRight
              size={15}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </motion.a>
        </div>

        {/* Address text strip (borderless/clean) */}
        <div className="flex items-center gap-2 text-[#475569] text-[13px] sm:text-[14px] mb-4">
          <MapPin size={15} className="text-[#DC2626] shrink-0" />
          <span className="leading-normal">{ADDRESS_TEXT}</span>
        </div>

        {/* Google Maps Embed iframe directly without outer card frame */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="w-full h-[360px] sm:h-[420px] md:h-[480px] rounded-[16px] overflow-hidden border border-[#E2E8F0] shadow-sm relative bg-[#F1F5F9]"
        >
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            title="Shivaay Enterprise Location Map"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMap;
