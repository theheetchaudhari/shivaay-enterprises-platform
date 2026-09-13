import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Privacy Policy | Shivaay Enterprises';

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
      'Privacy Policy for Shivaay Enterprises. Learn how we handle your personal information, customer account, address details, and WhatsApp quote requests.'
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
    linkCanonical.setAttribute('href', 'https://shivaayenterprise.com/privacy-policy');

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
              Legal &amp; Policy
            </div>
            <h1 className="text-[30px] sm:text-[36px] md:text-[40px] font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.2] mb-4">
              Privacy Policy
            </h1>
            <div className="flex items-center gap-2 text-[14px] text-[#64748B]">
              <Calendar size={15} className="text-[#94A3B8]" />
              <span>Last Updated: 13 September 2026</span>
            </div>
          </header>

          {/* Introductory Notice */}
          <div className="space-y-4 text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] mb-10">
            <p>
              Shivaay Enterprises (&ldquo;Shivaay Enterprises&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
              respects your privacy and is committed to being transparent about how information is collected, used,
              stored, and shared when you use our website.
            </p>
            <p>
              This Privacy Policy explains how we handle information when you browse our website, create or use a
              customer account, maintain your profile or address information, use location-based address assistance,
              add products to your cart, or submit a product request/quote through WhatsApp.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-[15px] sm:text-[15.5px] leading-[1.75]">
            {/* 1. About Shivaay Enterprises */}
            <section id="section-1" className="pt-2 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-4">
                1. About Shivaay Enterprises
              </h2>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-5 space-y-3">
                <p>
                  <strong className="text-[#0F172A] font-semibold">Business Name:</strong> Shivaay Enterprises
                </p>
                <div>
                  <strong className="text-[#0F172A] font-semibold block mb-1">Address:</strong>
                  <div className="text-[#475569] leading-relaxed">
                    New Mangaldeep Society A-326, Rajpipla Rd,<br />
                    Udhyagnagar, Hifazat Nagar,<br />
                    Ankleshwar, Bharuch, Gujarat – 393002, India
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-[14px]">
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
                    +91 9408915910
                  </a>
                </div>
              </div>
            </section>

            {/* 2. Information We May Collect */}
            <section id="section-2" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                2. Information We May Collect
              </h2>
              <p className="text-[#475569] mb-5">
                Depending on how you use the website, we may collect or receive the following information:
              </p>

              <div className="space-y-6 pl-1 sm:pl-2">
                {/* 2.1 Account and Profile */}
                <div>
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">
                    Account and profile information
                  </h3>
                  <p className="text-[#475569] mb-2.5">
                    When you create or use a customer account, information associated with your account may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5 text-[#334155]">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Authentication information associated with your account</li>
                    <li>Information provided through supported sign-in methods</li>
                  </ul>
                  <p className="text-[#475569] text-[14px] mt-2.5 italic">
                    The website currently supports email/password authentication and Google sign-in.
                  </p>
                </div>

                {/* 2.2 Address information */}
                <div>
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">
                    Address information
                  </h3>
                  <p className="text-[#475569] mb-2.5">
                    If you choose to save an address to your customer profile, the information may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5 text-[#334155]">
                    <li>Address line(s)</li>
                    <li>Area</li>
                    <li>City</li>
                    <li>State</li>
                    <li>PIN code</li>
                    <li>Landmark</li>
                    <li>Other address details that you provide</li>
                  </ul>
                </div>

                {/* 2.3 Location information */}
                <div>
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">
                    Location information
                  </h3>
                  <p className="text-[#475569] mb-2">
                    The website may provide an optional &ldquo;Use my location&rdquo; feature to help you obtain or complete an address.
                  </p>
                  <p className="text-[#475569] mb-2">
                    If you activate this feature, your browser may provide your device&apos;s geographic coordinates. These coordinates may be used to obtain an approximate human-readable address through a third-party geocoding service and may be associated with the address information you save.
                  </p>
                  <p className="text-[#0F172A] font-medium text-[14px]">
                    You do not need to use the location feature simply to browse the website.
                  </p>
                </div>

                {/* 2.4 Cart information */}
                <div>
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">
                    Cart information
                  </h3>
                  <p className="text-[#475569]">
                    Products that you add to your shopping cart may be temporarily stored in your browser&apos;s local storage so that your cart can remain available while you use the website.
                  </p>
                </div>

                {/* 2.5 Quote/request information */}
                <div>
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">
                    Quote/request information
                  </h3>
                  <p className="text-[#475569] mb-2.5">
                    When you choose to submit a product request or quote through WhatsApp, the website prepares a message containing relevant information such as:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5 text-[#334155]">
                    <li>Your name</li>
                    <li>Phone number</li>
                    <li>Address information</li>
                    <li>Products requested</li>
                    <li>Quantities and related product/cart information</li>
                    <li>Other information necessary to communicate the request</li>
                  </ul>
                  <p className="text-[#475569] mt-2.5">
                    The message is then opened in WhatsApp for you to review and send.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. How We Use Your Information */}
            <section id="section-3" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                3. How We Use Your Information
              </h2>
              <p className="text-[#475569] mb-3">
                We use information collected through the website for purposes such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#334155] mb-5">
                <li>Creating and maintaining your customer account</li>
                <li>Maintaining your customer profile</li>
                <li>Saving and managing addresses you choose to provide</li>
                <li>Helping you complete an address using the optional location feature</li>
                <li>Maintaining your shopping cart</li>
                <li>Preparing product requests or quote messages</li>
                <li>Communicating with you about a product request</li>
                <li>Responding to questions, requests, or support matters</li>
                <li>Protecting the website and maintaining its security</li>
                <li>Meeting applicable legal or regulatory requirements where applicable</li>
              </ul>
              <div className="bg-[#F8FAFC] border-l-4 border-[#0F172A] p-4 rounded-r-[8px]">
                <p className="text-[#0F172A] font-semibold text-[14.5px]">
                  We do not use your customer information for marketing or promotional communications.
                </p>
              </div>
            </section>

            {/* 4. WhatsApp Requests */}
            <section id="section-4" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                4. WhatsApp Requests
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  When you choose to request a quote or product information through WhatsApp, the website prepares a message for the official Shivaay Enterprises WhatsApp contact.
                </p>
                <p className="text-[#0F172A] font-medium">
                  The message is not automatically treated as a confirmed order.
                </p>
                <p>
                  After you send the message, Shivaay Enterprises may review the request and communicate with you regarding availability, feasibility, pricing, or other relevant details.
                </p>
                <p>
                  WhatsApp is a third-party service and its own privacy practices may apply to information processed through its service.
                </p>
              </div>
            </section>

            {/* 5. Third-Party Services */}
            <section id="section-5" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                5. Third-Party Services
              </h2>
              <p className="text-[#475569] mb-3">
                The website uses certain third-party services to provide its functionality. Depending on the feature you use, these may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#334155] mb-4">
                <li><strong className="text-[#0F172A]">Supabase</strong> for authentication and backend/database services</li>
                <li><strong className="text-[#0F172A]">Google</strong> when you choose Google authentication</li>
                <li><strong className="text-[#0F172A]">OpenStreetMap / Nominatim</strong> for address-related reverse geocoding when you use the location feature</li>
                <li><strong className="text-[#0F172A]">WhatsApp</strong> when you choose to send a quote/request</li>
                <li>Other technical services required to operate and display the website</li>
              </ul>
              <p className="text-[#475569]">
                These third-party services may process information in accordance with their own terms and privacy policies.
              </p>
            </section>

            {/* 6. Cookies and Similar Technologies */}
            <section id="section-6" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                6. Cookies and Similar Technologies
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  The website does not intentionally use advertising cookies or analytics/tracking systems for marketing purposes.
                </p>
                <p>
                  Certain authentication or website functionality may use browser-based storage or technologies required to maintain functionality.
                </p>
                <p>
                  Your shopping cart, for example, may be stored locally in your browser.
                </p>
              </div>
            </section>

            {/* 7. How We Protect Information */}
            <section id="section-7" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                7. How We Protect Information
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  We take reasonable measures to protect information handled through the website and use established technical services for authentication and backend functionality.
                </p>
                <p>
                  However, no internet-based service can be guaranteed to be completely secure. You should also take reasonable steps to protect your account credentials and device.
                </p>
              </div>
            </section>

            {/* 8. How Long We Keep Information */}
            <section id="section-8" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                8. How Long We Keep Information
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  Shivaay Enterprises does not currently operate an automated customer-account deletion or retention schedule.
                </p>
                <p>
                  Customer information may be retained while it is reasonably required for the purposes described in this Privacy Policy.
                </p>
                <p>
                  If you want your customer information to be deleted, you may contact us using the details below. At present, deletion requests are handled manually.
                </p>
              </div>
            </section>

            {/* 9. Requesting Deletion or Correction */}
            <section id="section-9" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                9. Requesting Deletion or Correction
              </h2>
              <p className="text-[#475569] mb-3">
                You may contact Shivaay Enterprises if you want to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-[#334155] mb-5">
                <li>Request deletion of your customer information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request an update to your profile or address information</li>
                <li>Ask questions about information associated with your account</li>
              </ul>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-4 sm:p-5 space-y-2 text-[14px]">
                <p className="font-semibold text-[#0F172A] mb-1">Requests can be made using:</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
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
                    +91 9408915910
                  </a>
                </div>
                <p className="text-[#64748B] text-[13px] pt-2">
                  We may need to verify your identity before acting on a request concerning your information.
                </p>
              </div>
            </section>

            {/* 10. Children */}
            <section id="section-10" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                10. Children
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  The website is intended for general use and is not specifically directed toward children.
                </p>
                <p>
                  If you believe that personal information relating to a child has been provided to us improperly, please contact us so that the matter can be reviewed.
                </p>
              </div>
            </section>

            {/* 11. Changes to This Privacy Policy */}
            <section id="section-11" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                11. Changes to This Privacy Policy
              </h2>
              <div className="space-y-3 text-[#475569]">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes to our website, business practices, technology, or applicable requirements.
                </p>
                <p>
                  When the policy is updated, the revised version will be made available on this page with an updated &ldquo;Last Updated&rdquo; date.
                </p>
              </div>
            </section>

            {/* 12. Privacy Contact */}
            <section id="section-12" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-3">
                12. Privacy Contact
              </h2>
              <p className="text-[#475569] mb-4">
                For privacy-related questions or requests, please contact:
              </p>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-5 space-y-2 text-[14.5px]">
                <p className="font-bold text-[#0F172A]">Shivaay Enterprises</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1">
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
                    +91 9408915910
                  </a>
                </div>
              </div>
            </section>

            {/* 13. Contact Information */}
            <section id="section-13" className="pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-bold text-[#0F172A] mb-4">
                13. Contact Information
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

export default PrivacyPolicy;
