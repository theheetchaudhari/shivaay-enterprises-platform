import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

const CartDrawer = () => {
  const { items, isDrawerOpen, closeDrawer, totalItems, subtotal, hasPricelessItems, clearCart } = useCart();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus the close button when drawer opens
  useEffect(() => {
    if (isDrawerOpen && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isDrawerOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const formattedSubtotal = `\u20B9${subtotal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
  })}`;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-[2px]"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            key="cart-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#FFFFFF] z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9] shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingCart size={18} className="text-[#0F172A]" />
                <h2 className="text-[16px] font-bold text-[#0F172A]">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-[#DC2626] text-[#FFFFFF] text-[11px] font-bold px-1.5">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-[#94A3B8] hover:text-[#DC2626] transition-colors cursor-pointer px-2 py-1 rounded"
                  >
                    Clear All
                  </button>
                )}
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close cart"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Items List / Empty State */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-4">
                    <ShoppingCart size={28} className="text-[#CBD5E1]" />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#0F172A] mb-1.5">
                    Your cart is empty
                  </h3>
                  <p className="text-[13px] text-[#64748B] max-w-[220px] leading-relaxed mb-6">
                    Browse our products and add items to your cart.
                  </p>
                  <Link to="/products" onClick={closeDrawer}>
                    <button
                      type="button"
                      className="px-6 h-[42px] rounded-[12px] bg-[#0F172A] text-[#FFFFFF] text-[14px] font-semibold hover:bg-[#1E293B] transition-all shadow-sm cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer — only shown when cart has items */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-[#F1F5F9] shrink-0 bg-[#FFFFFF]">
                {/* Subtotal Row */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold text-[#64748B]">
                    Subtotal
                  </span>
                  <span className="text-[16px] font-extrabold text-[#0F172A]">
                    {formattedSubtotal}
                  </span>
                </div>
                {hasPricelessItems && (
                  <p className="text-[11px] text-[#F59E0B] font-medium mb-3">
                    * Some items require pricing — contact us for a full quote.
                  </p>
                )}
                {!hasPricelessItems && (
                  <p className="text-[11px] text-[#64748B] mb-3">
                    Final price confirmed on order. Taxes & freight extra.
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2.5 mt-1">
                  <Link to="/contact" onClick={closeDrawer}>
                    <button
                      type="button"
                      className="w-full h-[46px] rounded-[12px] bg-[#DC2626] text-[#FFFFFF] text-[15px] font-bold hover:bg-[#b91c1c] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare size={17} />
                      <span>Request a Quote</span>
                    </button>
                  </Link>
                  <Link to="/products" onClick={closeDrawer}>
                    <button
                      type="button"
                      className="w-full h-[42px] rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-[14px] font-semibold hover:bg-[#F1F5F9] transition-all cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
