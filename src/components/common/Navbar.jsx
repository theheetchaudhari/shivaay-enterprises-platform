import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Insights', path: '/insights' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] bg-[#0F172A] flex items-center shadow-sm">
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-5 lg:px-6 flex justify-between items-center h-full">
        {/* Logo */}
        <NavLink to="/" className="flex items-center shrink-0">
          <img 
            src="/logo-white-text.png" 
            alt="Shivaay Enterprises" 
            className="h-10 md:h-12 lg:h-14 object-contain" 
          />
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name}
              to={link.path} 
              className={({ isActive }) => 
                `text-[16px] font-semibold transition-colors duration-200 ${
                  isActive ? "text-[#DC2626]" : "text-[#F8FAFC] hover:text-[#DC2626]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <NavLink to="/login">
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 h-[48px] rounded-[12px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] text-[16px] font-semibold hover:bg-[#F1F5F9] transition-all shadow-sm hover:shadow"
            >
              Login
            </motion.button>
          </NavLink>
          <NavLink to="/register">
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 h-[48px] rounded-[12px] bg-[#DC2626] text-[#FFFFFF] text-[16px] font-semibold hover:bg-[#b91c1c] transition-all shadow-sm hover:shadow"
            >
              Register
            </motion.button>
          </NavLink>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="text-[#FFFFFF] hover:text-[#DC2626] transition-colors p-2"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[72px] left-0 w-full bg-[#0F172A] border-t border-[#1e293b] shadow-lg md:hidden flex flex-col px-4 py-6 gap-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name}
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `text-[16px] font-semibold px-2 py-1 transition-colors duration-200 ${
                      isActive ? "text-[#DC2626]" : "text-[#F8FAFC] hover:text-[#DC2626]"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
            <div className="flex flex-col gap-4 pt-4 border-t border-[#1e293b]">
              <NavLink to="/login" onClick={() => setIsOpen(false)} className="w-full">
                <button className="w-full py-3 rounded-[12px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] text-[16px] font-semibold hover:bg-[#F1F5F9] transition-all">
                  Login
                </button>
              </NavLink>
              <NavLink to="/register" onClick={() => setIsOpen(false)} className="w-full">
                <button className="w-full py-3 rounded-[12px] bg-[#DC2626] text-[#FFFFFF] text-[16px] font-semibold hover:bg-[#b91c1c] transition-all">
                  Register
                </button>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
