import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Loader2, AlertCircle, ImageOff, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Animation variants (matches existing project patterns) ──────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.4, delay },
});

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }) {
  const [imgError, setImgError] = useState(false);

  const hasImage = product.image_url && !imgError;
  const formattedPrice = product.price != null
    ? `\u20B9${Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
    >
      {/* Product image */}
      <div className="relative h-52 sm:h-56 bg-[#F1F5F9] flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <img
            src={product.image_url}
            alt={product.name || 'Product'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#CBD5E1]">
            <ImageOff size={36} />
            <span className="text-[13px] font-medium">No image</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-5 sm:p-6 flex flex-col gap-2 flex-1">
        <h3 className="text-[17px] md:text-[18px] font-bold text-[#0F172A] leading-snug line-clamp-2">
          {product.name || 'Unnamed Product'}
        </h3>

        {product.description && (
          <p className="text-[14px] md:text-[15px] text-[#6B7280] leading-relaxed line-clamp-3">
            {product.description}
          </p>
        )}

        {formattedPrice && (
          <div className="mt-auto pt-4 border-t border-[#F1F5F9]">
            <span className="text-[20px] font-bold text-[#0F172A]">
              {formattedPrice}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 md:py-32">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 size={36} className="text-[#DC2626]" />
      </motion.div>
      <p className="mt-5 text-[16px] text-[#6B7280] font-medium">
        Loading products…
      </p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      {...fadeUp()}
      className="flex flex-col items-center justify-center py-24 md:py-32 text-center"
    >
      <div className="w-16 h-16 rounded-[16px] bg-[#FEF2F2] flex items-center justify-center mb-5">
        <AlertCircle size={32} className="text-[#DC2626]" />
      </div>
      <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">
        Something went wrong
      </h3>
      <p className="text-[15px] text-[#6B7280] max-w-md mb-6">
        {message || 'We couldn\u2019t load the products. Please try again.'}
      </p>
      <button
        onClick={onRetry}
        className="px-6 h-[44px] rounded-[12px] bg-[#0F172A] text-white text-[15px] font-semibold hover:bg-[#1E293B] transition-all shadow-sm hover:shadow"
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
      {...fadeUp()}
      className="flex flex-col items-center justify-center py-24 md:py-32 text-center"
    >
      <div className="w-20 h-20 rounded-[20px] bg-[#F1F5F9] flex items-center justify-center mb-5">
        <Package size={36} className="text-[#CBD5E1]" />
      </div>
      <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">
        No products available
      </h3>
      <p className="text-[15px] text-[#6B7280] max-w-xs">
        Our product catalogue is being updated. Please check back soon.
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

  // Fetch active products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setProducts(data ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Client-side search filtering
  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(q)) ||
      (product.description && product.description.toLowerCase().includes(q))
    );
  });

  return (
    <section className="w-full bg-[#F8FAFC] min-h-[calc(100vh-72px)]">
      {/* Content area */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-5 lg:px-6 py-8 md:py-12">
        <motion.div {...fadeUp()} className="mb-6 md:mb-8">
          <h1 className="text-[28px] md:text-[36px] font-bold text-[#0F172A] tracking-tight">
            Our Catalogue
          </h1>
        </motion.div>

        {/* Search bar (only show when we have products and not loading/error) */}
        {!loading && !error && products.length > 0 && (
          <motion.div
            {...fadeUp(0.1)}
            className="mb-8 md:mb-10"
          >
            <div className="relative max-w-md">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                <Search size={18} />
              </div>
              <input
                id="products-search-input"
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] text-[15px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 transition-all pl-11 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F1F5F9] transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* States */}
        {loading && <LoadingState />}

        {!loading && error && (
          <ErrorState message={error} onRetry={fetchProducts} />
        )}

        {!loading && !error && products.length === 0 && <EmptyState />}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            {filteredProducts.length === 0 ? (
              <motion.div
                {...fadeUp()}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-[16px] bg-[#F1F5F9] flex items-center justify-center mb-5">
                  <Search size={28} className="text-[#CBD5E1]" />
                </div>
                <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">
                  No products found
                </h3>
                <p className="text-[14px] text-[#6B7280] max-w-xs">
                  No products match &ldquo;{searchQuery}&rdquo;. Try a different search term.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Result count */}
                <motion.p
                  {...fadeUp()}
                  className="text-[14px] text-[#6B7280] mb-6"
                >
                  Showing {filteredProducts.length}{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'}
                  {searchQuery.trim() && ` for "${searchQuery.trim()}"`}
                </motion.p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
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
