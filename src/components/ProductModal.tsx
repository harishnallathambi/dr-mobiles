'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
import { formatPrice, calculateDiscount, getStockStatusColor, getStockStatusText } from '@/utils/helpers';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0]);
      setSelectedStorage(product.storage?.[0]);
      setQuantity(1);
    }
  }, [product]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!product) return null;

  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product, quantity, selectedColor, selectedStorage);
    showToast(`${product.name} added to cart!`, 'success');
    onClose();
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > product.stockQuantity) return product.stockQuantity;
      return next;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Product Image */}
              <div className="relative bg-[#F5F5F5] rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none flex items-center justify-center p-8 min-h-[300px] md:min-h-[480px]">
                {product.offerBadge && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                    {product.offerBadge}
                  </span>
                )}
                <div className="relative w-full h-64 md:h-80">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="p-6 md:p-8 flex flex-col gap-4">
                {/* Brand */}
                <span className="text-xs font-semibold uppercase tracking-widest text-[#D4A853]">
                  {product.brand}
                </span>

                {/* Name */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] font-outfit leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-[#0A0A0A]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${getStockStatusColor(product.stockStatus)}`}
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {getStockStatusText(product.stockStatus)}
                  </span>
                  {product.stockStatus === 'low-stock' && (
                    <span className="text-xs text-amber-600 font-medium">
                      (Only {product.stockQuantity} left)
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description}
                </p>

                {/* Warranty */}
                {product.warranty && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>{product.warranty}</span>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 text-sm rounded-full border-2 transition-all duration-200 ${
                            selectedColor === color
                              ? 'border-[#D4A853] bg-[#D4A853]/10 text-[#B8860B] font-semibold'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Storage Selector */}
                {product.storage && product.storage.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Storage</label>
                    <div className="flex flex-wrap gap-2">
                      {product.storage.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedStorage(size)}
                          className={`px-4 py-2 text-sm rounded-full border-2 transition-all duration-200 ${
                            selectedStorage === size
                              ? 'border-[#D4A853] bg-[#D4A853]/10 text-[#B8860B] font-semibold'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Quantity</label>
                  <div className="flex items-center gap-1 w-fit">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600 hover:border-[#D4A853] hover:text-[#D4A853] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center text-lg font-semibold text-[#0A0A0A]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockQuantity}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600 hover:border-[#D4A853] hover:text-[#D4A853] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full mt-2 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-white shadow-lg shadow-[#D4A853]/30 hover:shadow-xl hover:shadow-[#D4A853]/40 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
