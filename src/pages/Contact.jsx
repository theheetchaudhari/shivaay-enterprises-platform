import React, { useEffect } from 'react';
import ContactHero from '../components/contact/ContactHero';
import ContactInfo from '../components/contact/ContactInfo';
import ContactMap from '../components/contact/ContactMap';
import ContactCTA from '../components/contact/ContactCTA';
import ContactFAQ from '../components/contact/ContactFAQ';

const Contact = () => {
  // Manage SEO Metadata on page mount
  useEffect(() => {
    // 1. Page Title
    const originalTitle = document.title;
    document.title = 'Contact Us | Shivaay Enterprise';

    // 2. Meta Description
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
      'Contact Shivaay Enterprise for wholesale enquiries, product availability, pricing, and order assistance.'
    );

    // 3. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    let createdCanonical = false;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
      createdCanonical = true;
    }
    const originalCanonical = linkCanonical.getAttribute('href');
    linkCanonical.setAttribute('href', 'https://shivaayenterprise.com/contact');

    // Scroll to top on mount
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
    <div className="w-full">
      {/* 1. Hero Section */}
      <ContactHero />

      {/* 2. Contact Information Grid */}
      <ContactInfo />

      {/* 3. Google Map Section */}
      <ContactMap />

      {/* 4. Contact Call to Action */}
      <ContactCTA />

      {/* 5. FAQ Section */}
      <ContactFAQ />
    </div>
  );
};

export default Contact;
