import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertCircle, ImageOff, Search, X, Check, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { publicSupabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

// ─── Product Card Component ───────────────────────────────────────────────────
function ProductCard({ product, index }) {
  const [imgError, setImgError] = useState(false);
  const { addToCart, updateQty, removeFromCart, getItemQty } = useCart();

  const hasImage = product.image_url && !imgError;
  const formattedPrice =
    product.price != null
      ? `\u20B9${Number(product.price).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
      })}`
      : null;

  const cartQty = getItemQty(product.id);
  const inCart = cartQty > 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.35, delay: Math.min((index % 8) * 0.04, 0.3) }}
      className="group bg-[#FFFFFF] rounded-[14px] sm:rounded-[16px] border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      <Link
        to={`/products/${product.id}`}
        className="flex flex-col h-full flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
      >
        {/* Product Image Container */}
        <div className="relative aspect-square w-full bg-[#F8FAFC] border-b border-[#F1F5F9] flex items-center justify-center overflow-hidden p-3 sm:p-4">
          {hasImage ? (
            <img
              src={product.image_url}
              alt={product.name || 'Product'}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-[#CBD5E1]">
              <ImageOff size={28} />
              <span className="text-[11px] font-medium tracking-wide uppercase">
                No image
              </span>
            </div>
          )}

          {product.category && (
            <div className="absolute top-2.5 left-2.5">
              <span className="inline-block font-akronim bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#E2E8F0] text-[#475569] text-[14px] sm:text-[16px] px-2.5 py-0.5 rounded-full tracking-wider leading-none pt-1">
                {product.category}
              </span>
            </div>
          )}

          {/* In-cart badge */}
          {inCart && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Check size={10} />
                In Cart
              </span>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="p-3 sm:p-4 md:p-4 flex flex-col flex-1 justify-between gap-2">
          <div>
            <h3 className="text-[13px] sm:text-[15px] md:text-[15px] font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#DC2626] transition-colors">
              {product.name || 'Unnamed Product'}
            </h3>

            {product.description && (
              <p className="text-[11px] sm:text-[12px] md:text-[13px] text-[#64748B] mt-1 line-clamp-2 hidden sm:block leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Price & Action Row */}
          <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between gap-2 mt-auto">
            <div>
              {formattedPrice ? (
                <span className="text-[13px] sm:text-[15px] md:text-[16px] font-extrabold text-[#0F172A] tracking-tight">
                  {formattedPrice}
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#DC2626]">
                  Enquire Pricing
                </span>
              )}
            </div>

            {/* Green Add to Cart / Quantity Stepper aligned with price */}
            {cartQty > 0 ? (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="h-7 sm:h-8 px-0.5 rounded-[8px] bg-[#16A34A] text-[#FFFFFF] border border-[#16A34A] flex items-center shadow-xs overflow-hidden shrink-0"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (cartQty <= 1) {
                      removeFromCart(product.id);
                    } else {
                      updateQty(product.id, cartQty - 1);
                    }
                  }}
                  aria-label={`Decrease quantity of ${product.name || 'product'}`}
                  className="w-6 sm:w-7 h-full flex items-center justify-center text-white/90 hover:text-white hover:bg-[#15803D] active:scale-90 transition-colors cursor-pointer"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <span className="w-6 sm:w-7 text-center text-[12px] sm:text-[13px] font-bold text-white select-none">
                  {cartQty}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQty(product.id, cartQty + 1);
                  }}
                  aria-label={`Increase quantity of ${product.name || 'product'}`}
                  className="w-6 sm:w-7 h-full flex items-center justify-center text-white/90 hover:text-white hover:bg-[#15803D] active:scale-90 transition-colors cursor-pointer"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                aria-label={`Add ${product.name || 'product'} to cart`}
                className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-[8px] text-[11px] sm:text-[12px] font-bold bg-[#FFFFFF] text-[#16A34A] border border-[#16A34A] hover:bg-[#F0FDF4] active:scale-95 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer shrink-0"
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton Screen Components ──────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="bg-[#FFFFFF] rounded-[14px] sm:rounded-[16px] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-[#F8FAFC] border-b border-[#F1F5F9] p-3 sm:p-4 flex items-center justify-center">
        {/* Category Badge skeleton */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <Skeleton width={60} height={18} borderRadius={9999} />
        </div>
        {/* Centered Image placeholder */}
        <div className="w-full h-full flex items-center justify-center p-2">
          <Skeleton
            width={120}
            height={120}
            borderRadius={16}
            className="max-w-full max-h-full"
          />
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-3 sm:p-4 md:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Title lines */}
          <Skeleton width="88%" height={16} borderRadius={6} />
          <div className="mt-1.5">
            <Skeleton width="60%" height={14} borderRadius={6} />
          </div>

          {/* Description lines (desktop) */}
          <div className="hidden sm:block mt-2.5 space-y-1">
            <Skeleton width="100%" height={11} borderRadius={4} />
            <Skeleton width="75%" height={11} borderRadius={4} />
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between gap-2 mt-auto">
          {/* Price */}
          <Skeleton width={68} height={20} borderRadius={6} />
          {/* Add button */}
          <Skeleton width={58} height={30} borderRadius={8} />
        </div>
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <SkeletonTheme baseColor="#E2E8F0" highlightColor="#F8FAFC">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton width={120} height={16} borderRadius={6} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-24 md:py-32 text-center"
    >
      <div className="w-14 h-14 rounded-[14px] bg-[#FEF2F2] flex items-center justify-center mb-4 border border-[#FECACA]">
        <AlertCircle size={28} className="text-[#DC2626]" />
      </div>
      <h3 className="text-[17px] font-bold text-[#0F172A] mb-1.5">
        Unable to load products
      </h3>
      <p className="text-[14px] text-[#64748B] max-w-sm mb-5 leading-normal">
        {message || 'We could not load the product catalogue. Please try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="px-6 h-[42px] rounded-[12px] bg-[#0F172A] text-white text-[14px] font-semibold hover:bg-[#1E293B] transition-all shadow-sm cursor-pointer"
      >
        Try Again
      </button>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-24 md:py-32 text-center"
    >
      <div className="w-16 h-16 rounded-[16px] bg-[#F1F5F9] flex items-center justify-center mb-4 border border-[#E2E8F0]">
        <Package size={28} className="text-[#CBD5E1]" />
      </div>
      <h3 className="text-[17px] font-bold text-[#0F172A] mb-1.5">
        No products available
      </h3>
      <p className="text-[14px] text-[#64748B] max-w-xs leading-normal">
        Our product catalogue is currently being updated. Please check back soon.
      </p>
    </motion.div>
  );
}

// ─── Products Page ────────────────────────────────────────────────────────────
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await publicSupabase
        .from('products')
        .select('*')
        .or('is_active.eq.true,is_active.is.null')
        .order('created_at', { ascending: false, nullsFirst: false });

      if (fetchErr) throw fetchErr;
      setProducts(data ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(q)) ||
      (product.description && product.description.toLowerCase().includes(q)) ||
      (product.category && product.category.toLowerCase().includes(q))
    );
  });

  return (
    <section className="w-full bg-[#F8FAFC] min-h-[calc(100vh-72px)] py-8 sm:py-10 md:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-5 md:px-6">
        {/* Header and Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-flex font-barriecito items-center gap-1.5 text-[#DC2626] text-[18px] tracking-widest uppercase mb-1.5">
              <span>Wholesale &amp; Retail</span>
            </div>
            <h1 className="text-[28px] sm:text-[34px] md:text-[38px] font-heading font-extrabold text-[#0F172A] tracking-tight">
              Our Products
            </h1>
            <p className="text-[14px] sm:text-[15px] text-[#64748B] mt-1">
              Browse our complete range of premium beverages and FMCG products.
            </p>
          </motion.div>

          {loading && (
            <div className="w-full md:w-80 shrink-0">
              <SkeletonTheme baseColor="#E2E8F0" highlightColor="#F8FAFC">
                <Skeleton height={44} borderRadius={12} />
              </SkeletonTheme>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="w-full md:w-80 shrink-0"
            >
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                  <Search size={16} />
                </div>
                <input
                  id="products-search-input"
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-[#FFFFFF] border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 transition-all pl-10 pr-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* State Displays */}
        {loading && <ProductsSkeleton />}
        {!loading && error && <ErrorState message={error} onRetry={fetchProducts} />}
        {!loading && !error && products.length === 0 && <EmptyState />}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-14 h-14 rounded-[14px] bg-[#F1F5F9] flex items-center justify-center mb-4">
                  <Search size={22} className="text-[#CBD5E1]" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">
                  No matching products
                </h3>
                <p className="text-[13px] text-[#64748B] max-w-xs">
                  No products match &ldquo;{searchQuery}&rdquo;. Try another keyword.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] text-[#64748B] font-medium">
                    Showing <strong className="text-[#0F172A]">{filteredProducts.length}</strong>{' '}
                    {filteredProducts.length === 1 ? 'item' : 'items'}
                    {searchQuery.trim() && ` for "${searchQuery.trim()}"`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
