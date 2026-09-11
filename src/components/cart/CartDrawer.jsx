import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, UserCircle, LogIn, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { supabase } from '../../lib/supabase';
import CartItem from './CartItem';
import WhatsAppIcon from '../common/WhatsAppIcon';

// ─── WhatsApp Quote URL Generator ─────────────────────────────────────────────
const WHATSAPP_NUMBER = '919408915910';

function formatWhatsAppCurrency(amount) {
  return Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function generateWhatsAppUrl(items, totalItems, subtotal, customerDetails) {
  const itemLines = items
    .map((item, i) => {
      const hasPrice = item.price != null && !isNaN(Number(item.price));
      if (hasPrice) {
        const price = Number(item.price);
        const lineTotal = price * item.quantity;
        return `${i + 1}. ${item.name}\n   Qty: ${item.quantity} × \u20B9${formatWhatsAppCurrency(price)} = \u20B9${formatWhatsAppCurrency(lineTotal)}`;
      } else {
        return `${i + 1}. ${item.name}\n   Qty: ${item.quantity} × Price on Request`;
      }
    })
    .join('\n\n');

  const border = '━━━━━━━━━━━━━━━━━━';

  const messageParts = [
    'Hello Shivaay Enterprise,',
    '',
    'I would like to place an order for:',
    '',
    itemLines,
    '',
    border,
    `Total Items: ${totalItems}`,
    `Total Amount: \u20B9${formatWhatsAppCurrency(subtotal)}`,
    border,
    '',
  ];

  if (customerDetails && customerDetails.profile) {
    const p = customerDetails.profile;
    const a = customerDetails.address;

    messageParts.push('*CUSTOMER DETAILS*');
    messageParts.push('');
    const fullName = (p.full_name || '').trim();
    messageParts.push(fullName ? `Name: *${fullName}*` : 'Name:');
    messageParts.push(`Phone: ${(p.phone || '').trim()}`);
    messageParts.push('');

    const addressLines = ['Address:'];
    if (a?.address_line_1?.trim()) addressLines.push(`*${a.address_line_1.trim()}*`);
    if (a?.address_line_2?.trim()) addressLines.push(`*${a.address_line_2.trim()}*`);
    if (a?.area?.trim()) addressLines.push(`*${a.area.trim()}*`);

    const city = a?.city?.trim();
    const state = a?.state?.trim();
    const pincode = a?.pincode?.trim();
    if (city || state || pincode) {
      let locationLine = city && state ? `${city}, ${state}` : city || state || '';
      if (pincode) {
        locationLine = locationLine ? `${locationLine} - ${pincode}` : pincode;
      }
      if (locationLine) addressLines.push(`*${locationLine}*`);
    }

    if (a?.landmark?.trim()) addressLines.push(`*${a.landmark.trim()}*`);

    messageParts.push(addressLines.join('\n'));
    messageParts.push('');

    const hasCoords =
      a &&
      a.latitude != null &&
      a.longitude != null &&
      String(a.latitude).trim() !== '' &&
      String(a.longitude).trim() !== '';

    if (hasCoords) {
      messageParts.push(`📍 Map: https://www.google.com/maps/search/?api=1&query=${a.latitude},${a.longitude}`);
      messageParts.push('');
    }
  } else {
    messageParts.push('Please confirm the order and delivery details.');
    messageParts.push('');
  }

  messageParts.push('Thank you.');

  const message = messageParts.join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
const CartDrawer = () => {
  const { items, isDrawerOpen, closeDrawer, totalItems, subtotal, hasPricelessItems, clearCart } = useCart();
  const { user, loading: authLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [incompleteMessage, setIncompleteMessage] = useState(null);
  // loginPrompt: true when a guest clicked Request Quote
  const [loginPrompt, setLoginPrompt] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (user && isDrawerOpen) {
      setDetailsLoading(true);
      async function fetchDetails() {
        try {
          const [profileRes, addressRes] = await Promise.all([
            supabase.from('customers').select('*').eq('id', user.id).maybeSingle(),
            supabase.from('customer_addresses').select('*').eq('customer_id', user.id).maybeSingle()
          ]);
          
          if (isMounted) {
            setCustomerDetails({
              profile: profileRes.data || null,
              address: addressRes.data || null
            });
          }
        } catch (error) {
          console.error('Error fetching customer details for cart:', error);
        } finally {
          if (isMounted) setDetailsLoading(false);
        }
      }
      fetchDetails();
    }
    return () => { isMounted = false; };
  }, [user, isDrawerOpen]);

  // Clear banners and fetch state whenever the drawer reopens
  // (customer may have just logged in or completed their profile)
  useEffect(() => {
    if (isDrawerOpen) {
      setIncompleteMessage(null);
      setLoginPrompt(false);
      // Reset detailsLoading for the next fetch cycle
      if (!user) setDetailsLoading(false);
    }
  }, [isDrawerOpen, user]);

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

  const handleRequestQuote = useCallback(() => {
    if (items.length === 0) return;

    // ── Gate 1: Guest check ────────────────────────────────────────────────
    // Auth state is still resolving — do nothing (button is disabled below)
    if (authLoading) return;

    if (!user) {
      // Not logged in — show login prompt, do NOT generate WhatsApp URL
      setLoginPrompt(true);
      return;
    }

    // ── Gate 2: Customer details still loading ─────────────────────────────
    // Prevent a fast click from bypassing profile validation
    if (detailsLoading) return;

    // ── Gate 3: Profile completeness check (authenticated users only) ──────
    if (customerDetails !== null) {
      const p = customerDetails.profile;
      const a = customerDetails.address;

      const missingName    = !p?.full_name?.trim();
      const missingPhone   = !p?.phone?.trim();
      const missingAddress =
        !a?.address_line_1?.trim() ||
        !a?.area?.trim()           ||
        !a?.city?.trim()           ||
        !a?.state?.trim()          ||
        !a?.pincode?.trim();

      const missingProfileInfo = missingName || missingPhone;

      if (missingProfileInfo || missingAddress) {
        let msg;
        if (missingProfileInfo && missingAddress) {
          msg = 'Please complete your profile and delivery address before requesting a quote.';
        } else if (missingProfileInfo) {
          if (missingName && missingPhone) {
            msg = 'Please add your full name and phone number before requesting a quote.';
          } else if (missingName) {
            msg = 'Please add your full name before requesting a quote.';
          } else {
            msg = 'Please add your phone number before requesting a quote.';
          }
        } else {
          msg = 'Please add your delivery address before requesting a quote.';
        }
        setIncompleteMessage(msg);
        return;
      }
    }

    // All checks passed — proceed with existing WhatsApp flow (unchanged)
    setIncompleteMessage(null);
    setLoginPrompt(false);
    const url = generateWhatsAppUrl(items, totalItems, subtotal, customerDetails);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [items, totalItems, subtotal, customerDetails, user, authLoading, detailsLoading]);

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
                    Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </span>
                  <span className="text-[16px] font-extrabold text-[#0F172A]">
                    {formattedSubtotal}
                  </span>
                </div>
                {hasPricelessItems && (
                  <p className="text-[11px] text-[#F59E0B] font-medium mb-3">
                    * Some items require pricing — we'll share details on WhatsApp.
                  </p>
                )}
                {!hasPricelessItems && (
                  <p className="text-[11px] text-[#64748B] mb-3">
                    Final pricing confirmed after quote. Taxes &amp; freight extra.
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2.5 mt-1">

                  {/* Incomplete profile banner — authenticated users only */}
                  <AnimatePresence>
                    {incompleteMessage && (
                      <motion.div
                        key="incomplete-banner"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                        className="flex flex-col gap-2 px-4 py-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-[12px]"
                        role="alert"
                        aria-live="assertive"
                      >
                        <p className="text-[13px] font-semibold text-[#92400E] leading-snug">
                          Complete your delivery details
                        </p>
                        <p className="text-[12px] text-[#B45309] leading-relaxed">
                          {incompleteMessage}
                        </p>
                        <button
                          id="cart-complete-profile-btn"
                          type="button"
                          onClick={() => {
                            closeDrawer();
                            navigate('/profile');
                          }}
                          className="flex items-center gap-1.5 text-[13px] font-bold text-[#92400E] hover:text-[#78350F] transition-colors self-start cursor-pointer underline underline-offset-2"
                        >
                          <UserCircle size={15} />
                          Complete Profile
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Guest login prompt banner */}
                  <AnimatePresence>
                    {loginPrompt && !user && (
                      <motion.div
                        key="login-banner"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                        className="flex flex-col gap-2 px-4 py-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[12px]"
                        role="alert"
                        aria-live="assertive"
                      >
                        <p className="text-[13px] font-semibold text-[#DC2626] leading-snug">
                          Please log in to continue
                        </p>
                        <p className="text-[12px] text-[#3B5F8A] leading-relaxed">
                          Sign in to add your contact and delivery details before requesting a quote.
                        </p>
                        <button
                          id="cart-login-btn"
                          type="button"
                          onClick={() => {
                            closeDrawer();
                            navigate('/login');
                          }}
                          className="flex items-center gap-1.5 text-[13px] font-bold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors self-start cursor-pointer underline underline-offset-2"
                        >
                          <LogIn size={15} />
                          Log In
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Primary: Request Quote on WhatsApp */}
                  <button
                    type="button"
                    id="cart-request-quote-btn"
                    onClick={handleRequestQuote}
                    disabled={user && detailsLoading}
                    className="w-full h-[46px] rounded-[12px] bg-[#25D366] text-[#FFFFFF] text-[15px] font-bold hover:bg-[#1DA851] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                  >
                    {user && detailsLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin shrink-0" />
                        <span>Loading your details…</span>
                      </>
                    ) : (
                      <>
                        <WhatsAppIcon size={20} className="shrink-0" />
                        <span>Request Quote on WhatsApp</span>
                      </>
                    )}
                  </button>

                  {/* Secondary: Continue Shopping */}
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
