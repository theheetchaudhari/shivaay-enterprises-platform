import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, UserCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);

  const handleCartClick = () => {
    closeMenu();
    openDrawer();
  };

  const handleAccountClick = () => {
    closeMenu();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] bg-[#0F172A] flex items-center shadow-sm">
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-5 lg:px-6 flex justify-between items-center h-full">

        {/* Logo */}
        <NavLink to="/" className="flex items-center shrink-0" onClick={closeMenu}>
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
                  isActive ? 'text-[#DC2626]' : 'text-[#F8FAFC] hover:text-[#DC2626]'
                }`
              }
              end={link.path === '/'}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right Icons: Cart + Account */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Cart Icon Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCartClick}
            aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
            className="relative w-10 h-10 rounded-[10px] bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-[#DC2626] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center px-1 leading-none"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </motion.span>
            )}
          </motion.button>

          {/* Account / Profile Icon */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAccountClick}
            aria-label="Go to login / account"
            className="w-10 h-10 rounded-[10px] bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <UserCircle2 size={20} />
          </motion.button>
        </div>

        {/* Mobile: Cart + Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Cart Icon */}
          <button
            type="button"
            onClick={handleCartClick}
            aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
            className="relative w-9 h-9 rounded-[9px] bg-[#1E293B] flex items-center justify-center text-[#F8FAFC] cursor-pointer"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-[#DC2626] text-[#FFFFFF] text-[9px] font-bold flex items-center justify-center px-1 leading-none">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-[#FFFFFF] hover:text-[#DC2626] transition-colors p-2 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-[72px] left-0 w-full bg-[#0F172A] border-t border-[#1E293B] shadow-lg md:hidden flex flex-col px-4 py-5 gap-5 z-40"
          >
            {/* Nav Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `text-[15px] font-semibold px-3 py-2.5 rounded-[10px] transition-colors duration-200 ${
                      isActive
                        ? 'text-[#DC2626] bg-[#1E293B]'
                        : 'text-[#F8FAFC] hover:text-[#DC2626] hover:bg-[#1E293B]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile Account Button */}
            <div className="pt-3 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={handleAccountClick}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[#F8FAFC] hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                <UserCircle2 size={18} className="text-[#94A3B8]" />
                <span className="text-[15px] font-semibold">My Account</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
