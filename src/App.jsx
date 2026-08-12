import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Hero from './components/home/Hero';
import TrustSection from './components/home/TrustSection';
import Partners from './components/home/Partners';
import WholeCTA from './components/home/WholeCTA';
import Footer from './components/common/Footer';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';

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
      {/* Public website */}
      <Route path="/" element={<HomeLayout />} />

      {/* Admin routes — no public Navbar/Footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } 
      />
      <Route
        path="/admin/products"
        element={
          <AdminProtectedRoute>
            <AdminProducts />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
