import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2,
  AlertCircle,
  ImageOff,
  Package,
  ArrowLeft,
  ShoppingCart,
  Truck,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Sparkles,
  ChevronRight,
  FileText,
  Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] },
});

// ─── Loading State ────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-[20px] bg-[#F1F5F9] flex items-center justify-center mb-4 border border-[#E5E7EB]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={30} className="text-[#DC2626]" />
        </motion.div>
      </div>
      <p className="text-[16px] text-[#0F172A] font-semibold">
        Fetching product information…
      </p>
      <p className="mt-1 text-[14px] text-[#6B7280]">
        Please wait a moment while we retrieve the latest details.
      </p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-5 lg:px-6 py-12 md:py-20">
      <motion.div
        {...fadeUp()}
        className="flex flex-col items-center justify-center max-w-md mx-auto p-8 rounded-[24px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm text-center"
      >
        <div className="w-16 h-16 rounded-[20px] bg-[#FEF2F2] flex items-center justify-center mb-5 border border-[#FECACA]">
          <AlertCircle size={32} className="text-[#DC2626]" />
        </div>
        <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">
          Unable to load product
        </h3>
        <p className="text-[14px] text-[#6B7280] mb-6 leading-relaxed">
          {message || 'We encountered an error loading this product. Please check your connection and try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onRetry}
            className="flex-1 h-[48px] rounded-[12px] bg-[#0F172A] text-white text-[15px] font-semibold hover:bg-[#1E293B] active:scale-[0.98] transition-all shadow-sm"
          >
            Try Again
          </button>
          <Link to="/products" className="flex-1">
            <button className="w-full h-[48px] rounded-[12px] bg-[#F1F5F9] border border-[#E5E7EB] text-[#0F172A] text-[15px] font-semibold hover:bg-[#E2E8F0] active:scale-[0.98] transition-all">
              All Products
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Not Found State ──────────────────────────────────────────────────────────
function NotFoundState() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-5 lg:px-6 py-12 md:py-20">
      <motion.div
        {...fadeUp()}
        className="flex flex-col items-center justify-center max-w-md mx-auto p-8 rounded-[24px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm text-center"
      >
        <div className="w-20 h-20 rounded-[24px] bg-[#F1F5F9] flex items-center justify-center mb-5 border border-[#E5E7EB]">
          <Package size={40} className="text-[#94A3B8]" />
        </div>
        <h3 className="text-[22px] font-bold text-[#0F172A] mb-2">
          Product Not Found
        </h3>
        <p className="text-[14px] text-[#6B7280] mb-8 leading-relaxed">
          The requested product does not exist, has been unlisted, or is currently out of stock.
        </p>
        <Link to="/products" className="w-full">
          <button className="w-full h-[48px] rounded-[12px] bg-[#DC2626] text-[#FFFFFF] text-[15px] font-semibold hover:bg-[#B91C1C] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2">
            <ArrowLeft size={18} />
            Back to Catalogue
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Product Details Page ─────────────────────────────────────────────────────
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { addToCart, isInCart } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, is_active')
        .eq('id', id)
        .single();

      if (fetchErr) {
        if (fetchErr.code === 'PGRST116') {
          setProduct(null);
        } else {
          throw fetchErr;
        }
      } else {
        setProduct(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchProductDetails} />;
  if (!product || product.is_active === false) return <NotFoundState />;

  const hasImage = product.image_url && !imgError;
  const formattedPrice = product.price != null
    ? `\u20B9${Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : null;

  return (
    <section className="w-full bg-[#F8FAFC] min-h-[calc(100vh-72px)] py-4 sm:py-6 lg:py-10 pb-28 md:pb-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-5 lg:px-6">

        {/* Breadcrumb Navigation - Mobile optimized */}
        <motion.nav {...fadeUp()} className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-[13px] sm:text-[14px] text-[#6B7280] font-medium overflow-x-auto whitespace-nowrap pb-1">
            <Link
              to="/"
              className="hover:text-[#0F172A] transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-[#94A3B8] shrink-0" />
            <Link
              to="/products"
              className="hover:text-[#0F172A] transition-colors"
            >
              Products
            </Link>
            <ChevronRight size={14} className="text-[#94A3B8] shrink-0" />
            <span className="text-[#0F172A] font-semibold truncate max-w-[180px] sm:max-w-[300px]">
              {product.name}
            </span>
          </div>
        </motion.nav>

        {/* Back Link Button */}
        <motion.div {...fadeUp(0.05)} className="mb-4 sm:mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] text-[13px] sm:text-[14px] font-semibold text-[#475569] hover:text-[#0F172A] hover:border-[#CBD5E1] shadow-2xs hover:shadow-xs transition-all active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </Link>
        </motion.div>

        {/* Main Product Display Card */}
        <motion.div
          {...fadeUp(0.1)}
          className="bg-[#FFFFFF] rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col md:flex-row"
        >
          {/* Image Section - Responsive Aspect Ratio */}
          <div className="w-full md:w-1/2 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border-b md:border-b-0 md:border-r border-[#E5E7EB] relative flex items-center justify-center p-6 sm:p-10 lg:p-12 min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            {hasImage ? (
              <div className="relative w-full h-full flex items-center justify-center group">
                <img
                  src={product.image_url}
                  alt={product.name || 'Product Image'}
                  onError={() => setImgError(true)}
                  className="max-w-full max-h-[280px] sm:max-h-[380px] md:max-h-[460px] object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-[#94A3B8] py-12">
                <div className="w-16 h-16 rounded-[20px] bg-[#E2E8F0] flex items-center justify-center">
                  <ImageOff size={32} />
                </div>
                <span className="text-[14px] font-semibold text-[#6B7280]">
                  No product preview available
                </span>
              </div>
            )}
          </div>

          {/* Info & Purchase Details Section */}
          <div className="w-full md:w-1/2 p-5 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Product Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF2F2] text-[#DC2626] text-[11px] sm:text-[12px] font-bold uppercase tracking-wider rounded-full border border-[#FECACA]">
                  <Sparkles size={12} />
                  Wholesale Direct
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] text-[#16A34A] text-[11px] sm:text-[12px] font-bold uppercase tracking-wider rounded-full border border-[#BBF7D0]">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  In Stock & Ready
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-[24px] sm:text-[32px] lg:text-[38px] font-bold text-[#0F172A] leading-[1.2] mb-4 tracking-tight">
                {product.name || 'Unnamed Product'}
              </h1>

              {/* Price Box */}
              {formattedPrice ? (
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-4 sm:p-5 mb-6">
                  <div className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
                    Wholesale Price
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[28px] sm:text-[36px] font-black text-[#0F172A] tracking-tight">
                      {formattedPrice}
                    </span>
                    <span className="text-[13px] text-[#6B7280] font-medium">
                      / unit (excl. tax & freight)
                    </span>
                  </div>
                  <p className="text-[12px] text-[#16A34A] font-semibold mt-2 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Bulk volume discounts available on order
                  </p>
                </div>
              ) : (
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-4 mb-6">
                  <span className="text-[16px] font-bold text-[#0F172A]">
                    Price on Request / Bulk Quote
                  </span>
                </div>
              )}

              {/* Enterprise B2B Trust Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-[12px] bg-[#F1F5F9]/60 border border-[#E5E7EB] flex items-center gap-2.5">
                  <Truck size={18} className="text-[#DC2626] shrink-0" />
                  <div>
                    <div className="text-[12px] font-bold text-[#0F172A]">Fast Delivery</div>
                    <div className="text-[11px] text-[#6B7280]">Pan-India Shipping</div>
                  </div>
                </div>

                <div className="p-3 rounded-[12px] bg-[#F1F5F9]/60 border border-[#E5E7EB] flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-[#16A34A] shrink-0" />
                  <div>
                    <div className="text-[12px] font-bold text-[#0F172A]">Verified Quality</div>
                    <div className="text-[11px] text-[#6B7280]">100% Guaranteed</div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              {product.description && (
                <div className="mb-6 pt-5 border-t border-[#E5E7EB]">
                  <h2 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-[#6B7280]" />
                    Product Description
                  </h2>
                  <p className="text-[14px] sm:text-[15px] text-[#475569] leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Action Buttons */}
            <div className="pt-4 border-t border-[#E5E7EB] hidden md:flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 h-[52px] rounded-[12px] text-[15px] font-bold active:scale-[0.98] transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer ${addedFeedback
                    ? 'bg-[#16A34A] text-[#FFFFFF]'
                    : isInCart(product?.id)
                      ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] hover:bg-[#DCFCE7]'
                      : 'bg-[#DC2626] text-[#FFFFFF] hover:bg-[#B91C1C]'
                  }`}
              >
                {addedFeedback ? (
                  <><Check size={18} /><span>Added to Cart!</span></>
                ) : isInCart(product?.id) ? (
                  <><ShoppingCart size={18} /><span>Add Again</span></>
                ) : (
                  <><ShoppingCart size={18} /><span>Add to Cart</span></>
                )}
              </button>

              <Link to="/contact" className="flex-1">
                <button className="w-full h-[52px] rounded-[12px] bg-[#0F172A] text-white text-[15px] font-bold hover:bg-[#1E293B] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                  <MessageSquare size={18} />
                  <span>Bulk Inquiry</span>
                </button>
              </Link>
            </div>

          </div>
        </motion.div>

      </div>

      {/* Mobile Sticky Bottom Bar (Only visible on screens < 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 h-[48px] rounded-[12px] text-[14px] font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${addedFeedback
              ? 'bg-[#16A34A] text-white'
              : isInCart(product?.id)
                ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A]'
                : 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
            }`}
        >
          {addedFeedback ? (
            <><Check size={18} /><span>Added!</span></>
          ) : isInCart(product?.id) ? (
            <><ShoppingCart size={18} /><span>Add Again</span></>
          ) : (
            <><ShoppingCart size={18} /><span>Add to Cart</span></>
          )}
        </button>
        <Link to="/contact" className="flex-1">
          <button className="w-full h-[48px] rounded-[12px] bg-[#0F172A] text-white text-[14px] font-bold hover:bg-[#1E293B] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
            <MessageSquare size={18} />
            <span>Bulk Quote</span>
          </button>
        </Link>
      </div>

    </section>
  );
};

export default ProductDetails;

