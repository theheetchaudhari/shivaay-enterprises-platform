import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Hero from './components/home/Hero';
import TrustSection from './components/home/TrustSection';
import Partners from './components/home/Partners';
import WholeCTA from './components/home/WholeCTA';
import Footer from './components/common/Footer';
import Products from './pages/Products';

// Shared public layout — Navbar + page content + Footer
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// Home page content
function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <Partners />
      <WholeCTA />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Public website only — admin routes live exclusively in admin-main.jsx */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
    </Routes>
  );
}

export default App;
