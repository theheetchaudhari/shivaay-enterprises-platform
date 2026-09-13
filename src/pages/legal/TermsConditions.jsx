import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Terms & Conditions | Shivaay Enterprises';

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
      'Terms & Conditions for Shivaay Enterprises wholesale distribution website. Learn about account responsibilities, shopping cart usage, and WhatsApp quote requests.'
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
    linkCanonical.setAttribute('href', 'https://shivaayenterprise.com/terms-conditions');

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
              Legal &amp; Terms
            </div>
            <h1 className="text-[30px] sm:text-[36px] md:text-[40px] font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.2] mb-4">
              Terms &amp; Conditions
            </h1>
            <div className="flex items-center gap-2 text-[14px] text-[#64748B]">
              <Calendar size={15} className="text-[#94A3B8]" />
              <span>Last Updated: 13 September 2026</span>
            </div>
          </header>

          {/* Introductory Notice */}
          <div className="space-y-4 text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] mb-10">
            <p className="font-medium text-[#0F172A]">
              Welcome to the website of Shivaay Enterprises.
            </p>
            <p>
              By accessing or using this website, you agree to use it responsibly and in accordance with these Terms &amp; Conditions.
            </p>
            <p>
              These terms are intended to describe the current functionality of the Shivaay Enterprises website, including product browsing, customer accounts, shopping carts, and product requests through WhatsApp.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-[15px] sm:text-[15.5px] leading-[1.75]">
            {/* 1. About the Website */}
            <section id="section-1" className="pt-2 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                1. About the Website
              </h2>
              <p className="text-[#475569] mb-3">
                The website allows visitors to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-[#334155]">
                <li>Browse products and product information</li>
                <li>Create and use a customer account</li>
                <li>Maintain profile and address information</li>
                <li>Add products to a shopping cart</li>
                <li>Prepare and send product requests or quote enquiries through WhatsApp</li>
              </ul>
            </section>

            {/* 2. Customer Accounts */}
            <section id="section-2" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                2. Customer Accounts
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  Some website features may require a customer account.
                </p>
                <p>
                  You are responsible for providing accurate information when creating or maintaining your account.
                </p>
                <p>
                  You are also responsible for keeping your account credentials secure and for activity carried out through your account.
                </p>
                <p className="text-[#0F172A] font-medium">
                  If you believe that your account has been accessed without authorization, please contact Shivaay Enterprises promptly.
                </p>
              </div>
            </section>

            {/* 3. Product Information */}
            <section id="section-3" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                3. Product Information
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  We aim to present product information as accurately as reasonably possible.
                </p>
                <p>
                  Product availability, specifications, pricing, images, quantities, and other information may change from time to time.
                </p>
                <p className="text-[#0F172A] font-medium">
                  A product being displayed on the website does not by itself guarantee availability at the time you make a request.
                </p>
              </div>
            </section>

            {/* 4. Shopping Cart */}
            <section id="section-4" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                4. Shopping Cart
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  The shopping cart is provided as a convenience for preparing a product request.
                </p>
                <p className="text-[#0F172A] font-medium">
                  Adding a product to the cart does not constitute an order or create a binding purchase agreement.
                </p>
                <p>
                  Cart information may be stored locally in your browser.
                </p>
              </div>
            </section>

            {/* 5. WhatsApp Quote / Product Request */}
            <section id="section-5" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                5. WhatsApp Quote / Product Request
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  The website may provide an option to prepare a WhatsApp message containing details of your selected products and relevant customer information.
                </p>
                <p>
                  You can review the message before sending it.
                </p>
                <p className="text-[#0F172A] font-semibold">
                  Sending the WhatsApp message constitutes a request or enquiry and does not automatically constitute a confirmed order.
                </p>
                <p>
                  After receiving a request, Shivaay Enterprises may review:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-[#334155]">
                  <li>Product availability</li>
                  <li>Quantity</li>
                  <li>Feasibility</li>
                  <li>Pricing</li>
                  <li>Other relevant requirements</li>
                </ul>
                <p>
                  Shivaay Enterprises may then communicate with you regarding the request.
                </p>
                <p className="text-[#0F172A] font-medium">
                  Any final transaction or arrangement will be subject to confirmation between you and Shivaay Enterprises.
                </p>
              </div>
            </section>

            {/* 6. Accuracy of Customer Information */}
            <section id="section-6" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                6. Accuracy of Customer Information
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  You should provide accurate and current information when using account, profile, address, or request features.
                </p>
                <p>
                  Providing incorrect contact or address information may affect our ability to communicate with you or respond to your request.
                </p>
              </div>
            </section>

            {/* 7. Location Feature */}
            <section id="section-7" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                7. Location Feature
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  The website may provide an optional location feature to assist with entering an address.
                </p>
                <p>
                  The feature is activated by the user and depends on browser/device location permissions.
                </p>
                <p className="text-[#0F172A] font-medium">
                  Location information should be used only when you are comfortable providing it.
                </p>
              </div>
            </section>

            {/* 8. Third-Party Services */}
            <section id="section-8" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                8. Third-Party Services
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  Certain website functions depend on third-party services, including authentication, location/address assistance, and WhatsApp communication.
                </p>
                <p>
                  Use of those services may also be subject to the terms and policies of the respective third-party providers.
                </p>
              </div>
            </section>

            {/* 9. Acceptable Use */}
            <section id="section-9" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                9. Acceptable Use
              </h2>
              <p className="text-[#475569] mb-3">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-[#334155]">
                <li>Misuse the website</li>
                <li>Attempt unauthorized access to accounts, systems, or data</li>
                <li>Interfere with the operation or security of the website</li>
                <li>Submit deliberately false or misleading information</li>
                <li>Use the website for unlawful purposes</li>
                <li>Attempt to exploit or disrupt website functionality</li>
              </ul>
            </section>

            {/* 10. Website Availability */}
            <section id="section-10" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                10. Website Availability
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  We aim to keep the website available and functional, but we do not guarantee uninterrupted or error-free operation at all times.
                </p>
                <p>
                  The website may occasionally be unavailable because of maintenance, technical issues, third-party service interruptions, network problems, or circumstances outside our reasonable control.
                </p>
              </div>
            </section>

            {/* 11. Intellectual Property */}
            <section id="section-11" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                11. Intellectual Property
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  Unless otherwise indicated, content provided on the website, including branding, text, graphics, product presentation, and other website materials, is intended for use in connection with Shivaay Enterprises.
                </p>
                <p>
                  You should not reproduce, copy, modify, distribute, or commercially exploit website content without appropriate authorization.
                </p>
              </div>
            </section>

            {/* 12. Privacy */}
            <section id="section-12" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                12. Privacy
              </h2>
              <p className="text-[#475569]">
                Your use of the website is also subject to our{' '}
                <Link to="/privacy-policy" className="text-[#DC2626] font-medium hover:underline">
                  Privacy Policy
                </Link>
                , which explains how information is handled.
              </p>
            </section>

            {/* 13. Changes to These Terms */}
            <section id="section-13" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                13. Changes to These Terms
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  We may update these Terms &amp; Conditions when necessary to reflect changes to the website, business practices, or applicable requirements.
                </p>
                <p>
                  Updated terms will be published on this page with a revised &ldquo;Last Updated&rdquo; date.
                </p>
              </div>
            </section>

            {/* 14. Contact */}
            <section id="section-14" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-4">
                14. Contact
              </h2>
              <p className="text-[#475569] mb-4">
                For questions regarding these Terms &amp; Conditions, contact:
              </p>
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
                    className="inline-flex items-center gap-2 text-[#DC2626] hover:underline font-medium"
                  >
                    <Mail size={15} />
                    shivaayenterprises.orders@gmail.com
                  </a>
                  <a
                    href="tel:+919408915910"
                    className="inline-flex items-center gap-2 text-[#0F172A] hover:text-[#DC2626] font-medium transition-colors"
                  >
                    <Phone size={15} />
                    Phone: +91 9408915910
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

export default TermsConditions;
