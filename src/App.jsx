import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import Navbar from './components/common/Navbar';
import Hero from './components/home/Hero';
import TrustSection from './components/home/TrustSection';
import WholeCTA from './components/home/WholeCTA';
import Footer from './components/common/Footer';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import Login from './pages/Login';
import About from './pages/About';
import CartDrawer from './components/cart/CartDrawer';
import { CartProvider } from './context/CartContext';

// Shared public layout — Navbar + CartDrawer + page content + Footer
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans">
      <Navbar />
      <CartDrawer />
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
      <WholeCTA />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        {/* Public website only — admin routes live exclusively in admin-main.jsx */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetails /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
