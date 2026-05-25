'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/helpers';

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    onCheckout();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Panel */}
          <motion.div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#0A0A0A] font-outfit">Your Cart</h2>
                <span className="bg-[#D4A853] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Content */}
            {items.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-24 h-24 mb-6 text-gray-200">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth={1}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 font-outfit mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Looks like you haven&apos;t added any products yet.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-8 py-3 bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-white font-semibold rounded-xl shadow-lg shadow-[#D4A853]/30 hover:shadow-xl hover:shadow-[#D4A853]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.product.id}-${item.selectedColor}-${item.selectedStorage}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 p-4 bg-[#F5F5F5] rounded-2xl"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-xl overflow-hidden">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                            sizes="80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#0A0A0A] truncate">
                            {item.product.name}
                          </h4>
                          {(item.selectedColor || item.selectedStorage) && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {[item.selectedColor, item.selectedStorage].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          <p className="text-sm font-bold text-[#0A0A0A] mt-1">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#D4A853] hover:text-[#D4A853] transition-colors"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={item.quantity >= item.product.stockQuantity}
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#D4A853] hover:text-[#D4A853] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              aria-label="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-white">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-lg font-bold text-[#0A0A0A]">{formatPrice(totalAmount)}</span>
                  </div>

                  {/* Delivery Note */}
                  <p className="text-xs text-center text-gray-400">
                    {totalAmount >= 999
                      ? '✅ You qualify for free delivery!'
                      : `🚚 Free delivery on orders above ${formatPrice(999)}`}
                  </p>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-white font-semibold rounded-xl shadow-lg shadow-[#D4A853]/30 hover:shadow-xl hover:shadow-[#D4A853]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
