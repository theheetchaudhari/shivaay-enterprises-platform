import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowLeft, MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactGrievance = () => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Contact & Grievance | Shivaay Enterprises';

    let metaDescription = document.querySelector('meta[name="description"]');
    let createdMeta = false;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
      createdMeta = true;
    }
    const originalDescription = metaDescription.getAttribute('content');
    metaDescription.setAttribute(
      'content',
      'Contact information, privacy & data requests, and grievance redressal contacts for Shivaay Enterprises.'
    );

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    let createdCanonical = false;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
      createdCanonical = true;
    }
    const originalCanonical = linkCanonical.getAttribute('href');
    linkCanonical.setAttribute('href', 'https://shivaayenterprise.com/contact-grievance');

    window.scrollTo(0, 0);

    return () => {
      document.title = originalTitle;
      if (createdMeta) {
        metaDescription?.remove();
      } else if (originalDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
      if (createdCanonical) {
        linkCanonical?.remove();
      } else if (originalCanonical) {
        linkCanonical.setAttribute('href', originalCanonical);
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#F8FAFC] min-h-[calc(100vh-72px)] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[860px] mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Document Container */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-6 sm:p-10 md:p-12 text-[#334155] leading-relaxed"
        >
          {/* Header */}
          <header className="border-b border-[#E2E8F0] pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-[12px] font-semibold tracking-wider uppercase mb-4">
              Support &amp; Transparency
            </div>
            <h1 className="text-[30px] sm:text-[36px] md:text-[40px] font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.2] mb-3">
              Contact &amp; Grievance
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#64748B] leading-relaxed">
              Official contact channels, customer support points, privacy request handling, and grievance redressal for Shivaay Enterprises.
            </p>
          </header>

          {/* Sections */}
          <div className="space-y-10 text-[15px] sm:text-[15.5px] leading-[1.75]">
            {/* 1. Contact Shivaay Enterprises */}
            <section id="general-contact">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-2">
                Contact Shivaay Enterprises
              </h2>
              <p className="text-[#475569] mb-5">
                If you have a question about our products, website, customer account, quote request, or any other matter, you can contact Shivaay Enterprises using the details below.
              </p>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-5 space-y-4">
                <div>
                  <p className="font-bold text-[#0F172A] text-[16px] mb-1">Shivaay Enterprises</p>
                  <div>
                    <span className="text-[#0F172A] font-semibold block mb-1">Address:</span>
                    <div className="flex items-start gap-2.5 text-[#475569] leading-relaxed">
                      <MapPin size={16} className="text-[#DC2626] shrink-0 mt-1" />
                      <span>
                        New Mangaldeep Society A-326, Rajpipla Rd,<br />
                        Udhyagnagar, Hifazat Nagar,<br />
                        Ankleshwar, Bharuch, Gujarat – 393002, India
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
                  <div>
                    <span className="text-[#0F172A] font-semibold block mb-1">Email:</span>
                    <a
                      href="mailto:shivaayenterprises.orders@gmail.com"
                      className="inline-flex items-center gap-2 text-[#DC2626] hover:underline font-medium break-all"
                    >
                      <Mail size={15} className="shrink-0" />
                      shivaayenterprises.orders@gmail.com
                    </a>
                  </div>
                  <div>
                    <span className="text-[#0F172A] font-semibold block mb-1">Phone / WhatsApp:</span>
                    <div className="flex flex-col gap-1">
                      <a
                        href="tel:+919408915910"
                        className="inline-flex items-center gap-2 text-[#0F172A] hover:text-[#DC2626] font-medium transition-colors"
                      >
                        <Phone size={15} className="shrink-0" />
                        +91 9408915910
                      </a>
                      <a
                        href="https://wa.me/919408915910"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#16A34A] hover:underline font-medium text-[13px]"
                      >
                        <MessageSquare size={14} className="shrink-0" />
                        Message on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Privacy and Data Requests */}
            <section id="privacy-data-requests" className="pt-6 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-2.5 mb-2">
                <ShieldCheck size={20} className="text-[#DC2626]" />
                <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A]">
                  Privacy and Data Requests
                </h2>
              </div>
              <p className="text-[#475569] mb-4">
                For requests relating to your personal information, including correction or deletion requests, please contact:
              </p>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-[14px]">
                  <a
                    href="mailto:shivaayenterprises.orders@gmail.com"
                    className="inline-flex items-center gap-2 text-[#DC2626] hover:underline font-medium break-all"
                  >
                    <Mail size={15} className="shrink-0" />
                    shivaayenterprises.orders@gmail.com
                  </a>
                  <a
                    href="tel:+919408915910"
                    className="inline-flex items-center gap-2 text-[#0F172A] hover:text-[#DC2626] font-medium transition-colors"
                  >
                    <Phone size={15} className="shrink-0" />
                    +91 9408915910
                  </a>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <p className="text-[#64748B] text-[13.5px]">
                    We currently handle such requests manually.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Grievance Contact */}
            <section id="grievance-contact" className="pt-6 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-2.5 mb-2">
                <AlertCircle size={20} className="text-[#DC2626]" />
                <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A]">
                  Grievance Contact
                </h2>
              </div>
              <p className="text-[#475569] mb-4">
                For a grievance or complaint relating to the website or your interaction with Shivaay Enterprises, you may contact:
              </p>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                  <div>
                    <span className="text-[#0F172A] font-semibold block mb-1.5">Phone:</span>
                    <div className="flex flex-col gap-1.5">
                      <a
                        href="tel:+919408915910"
                        className="inline-flex items-center gap-2 text-[#0F172A] hover:text-[#DC2626] font-medium transition-colors"
                      >
                        <Phone size={15} className="shrink-0" />
                        +91 9408915910
                      </a>
                      <a
                        href="tel:+919081936116"
                        className="inline-flex items-center gap-2 text-[#0F172A] hover:text-[#DC2626] font-medium transition-colors"
                      >
                        <Phone size={15} className="shrink-0" />
                        +91 9081936116
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#0F172A] font-semibold block mb-1.5">Email:</span>
                    <a
                      href="mailto:shivaayenterprises.orders@gmail.com"
                      className="inline-flex items-center gap-2 text-[#DC2626] hover:underline font-medium break-all"
                    >
                      <Mail size={15} className="shrink-0" />
                      shivaayenterprises.orders@gmail.com
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-[14px] text-[#475569]">
                  <p>
                    Please provide enough information for us to understand the issue and, where relevant, identify the account or request involved.
                  </p>
                  <p className="text-[#0F172A] font-medium">
                    We will review the matter and communicate with you as appropriate.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactGrievance;
