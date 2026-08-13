import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Hero from './components/home/Hero';
import TrustSection from './components/home/TrustSection';
import Partners from './components/home/Partners';
import WholeCTA from './components/home/WholeCTA';
import Footer from './components/common/Footer';

// Public home layout — Navbar + all home sections + Footer
function HomeLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans">
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <Partners />
        <WholeCTA />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public website only — admin routes live exclusively in admin-main.jsx */}
      <Route path="/" element={<HomeLayout />} />
    </Routes>
  );
}

export default App;
