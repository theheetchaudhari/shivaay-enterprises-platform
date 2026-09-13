import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, ArrowLeft, CheckCircle2, Info, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccessibilityStatement = () => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Accessibility Statement | Shivaay Enterprises';

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
      'Accessibility Statement for Shivaay Enterprises. Our approach to making our website usable, accessible, and inclusive for all visitors.'
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
    linkCanonical.setAttribute('href', 'https://shivaayenterprise.com/accessibility-statement');

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
              Inclusion &amp; Usability
            </div>
            <h1 className="text-[30px] sm:text-[36px] md:text-[40px] font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.2] mb-4">
              Accessibility Statement
            </h1>
            <div className="flex items-center gap-2 text-[14px] text-[#64748B]">
              <Calendar size={15} className="text-[#94A3B8]" />
              <span>Last Updated: 13 September 2026</span>
            </div>
          </header>

          {/* Introductory Notice */}
          <div className="space-y-4 text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] mb-10">
            <p>
              Shivaay Enterprises is committed to making its website usable and accessible to as many people as reasonably possible.
            </p>
            <p>
              We aim to provide a website that can be navigated and understood by users with different needs and abilities.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10 text-[15px] sm:text-[15.5px] leading-[1.75]">
            {/* Our Accessibility Approach */}
            <section id="approach" className="pt-2 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                Our Accessibility Approach
              </h2>
              <p className="text-[#475569] mb-4">
                The website uses accessibility-focused practices such as:
              </p>
              <ul className="space-y-2.5 mb-5 pl-1">
                {[
                  'Semantic HTML where appropriate',
                  'Labels and accessible names for interactive controls',
                  'Alternative text for relevant images',
                  'Keyboard-friendly interaction for supported interface elements',
                  'Appropriate focus handling',
                  'Clear form controls and user-facing instructions',
                  'Responsive layouts for different screen sizes',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[#334155]">
                    <CheckCircle2 size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#475569] italic">
                These measures are part of our ongoing effort to improve the usability of the website.
              </p>
            </section>

            {/* No Formal Compliance Claim */}
            <section id="compliance-claim" className="pt-6 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-2 mb-2">
                <Info size={18} className="text-[#64748B]" />
                <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A]">
                  No Formal Compliance Claim
                </h2>
              </div>
              <div className="space-y-3 text-[#475569]">
                <p>
                  At present, Shivaay Enterprises has not conducted a formal accessibility audit or certification of the website.
                </p>
                <p>
                  Accordingly, this statement should not be interpreted as a claim that the website fully conforms to a particular accessibility standard or certification level.
                </p>
                <p className="text-[#0F172A] font-medium">
                  We will continue to improve accessibility as the website develops.
                </p>
              </div>
            </section>

            {/* Accessibility Feedback */}
            <section id="feedback" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                Accessibility Feedback
              </h2>
              <p className="text-[#475569] mb-4">
                If you experience difficulty accessing or using any part of the website, please let us know. You can contact us through:
              </p>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-5 space-y-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
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
                </div>
              </div>

              <div className="space-y-2 text-[#475569] text-[14.5px]">
                <p>
                  When contacting us, please describe the page or feature where you experienced difficulty and, if possible, what you were trying to do.
                </p>
                <p className="text-[#0F172A] font-medium">
                  Your feedback can help us identify areas where the website can be improved.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-4">
                Contact
              </h2>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-5 space-y-4">
                <div>
                  <p className="font-bold text-[#0F172A] text-[16px] mb-1">Shivaay Enterprises</p>
                  <div className="flex items-start gap-2.5 text-[#475569] text-[14.5px] leading-relaxed">
                    <MapPin size={16} className="text-[#DC2626] shrink-0 mt-1" />
                    <span>
                      New Mangaldeep Society A-326, Rajpipla Rd,<br />
                      Udhyagnagar, Hifazat Nagar,<br />
                      Ankleshwar, Bharuch, Gujarat – 393002, India
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-[14px]">
                  <a
                    href="mailto:shivaayenterprises.orders@gmail.com"
                    className="inline-flex items-center gap-2 text-[#DC2626] hover:underline font-medium break-all"
                  >
                    <Mail size={15} />
                    shivaayenterprises.orders@gmail.com
                  </a>
                  <a
                    href="https://wa.me/919408915910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#16A34A] hover:underline font-medium"
                  >
                    <MessageSquare size={15} />
                    WhatsApp: +91 9408915910
                  </a>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccessibilityStatement;
