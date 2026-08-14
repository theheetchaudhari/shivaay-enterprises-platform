import React from 'react';
import { motion } from 'framer-motion';
import { ImageOff, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQty, removeFromCart } = useCart();

  const formattedPrice =
    item.price != null && !isNaN(Number(item.price))
      ? `\u20B9${Number(item.price).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
        })}`
      : null;

  const lineTotal =
    item.price != null && !isNaN(Number(item.price))
      ? `\u20B9${(Number(item.price) * item.quantity).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
        })}`
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 py-4 border-b border-[#F1F5F9] last:border-b-0"
    >
      {/* Product Image */}
      <div className="w-16 h-16 shrink-0 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-contain p-1"
            loading="lazy"
          />
        ) : (
          <ImageOff size={20} className="text-[#CBD5E1]" />
        )}
      </div>

      {/* Info + Controls */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#0F172A] leading-snug line-clamp-2 mb-1">
          {item.name}
        </p>

        {formattedPrice ? (
          <p className="text-[12px] text-[#64748B] mb-2">
            {formattedPrice} / unit
          </p>
        ) : (
          <p className="text-[11px] font-semibold text-[#DC2626] mb-2">
            Price on Request
          </p>
        )}

        {/* Qty + Remove Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-0 rounded-[8px] border border-[#E2E8F0] overflow-hidden">
            <button
              type="button"
              onClick={() => updateQty(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
              className="w-7 h-7 flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-[13px] font-bold text-[#0F172A] select-none">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQty(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${item.name}`}
              className="w-7 h-7 flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Line total + Remove */}
          <div className="flex items-center gap-2">
            {lineTotal && (
              <span className="text-[13px] font-bold text-[#0F172A]">
                {lineTotal}
              </span>
            )}
            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
