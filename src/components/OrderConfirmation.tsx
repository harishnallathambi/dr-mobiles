'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '@/types';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/site';
import { formatPrice, buildWhatsAppUrl } from '@/utils/helpers';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

// Confetti particle component
function ConfettiParticle({ index }: { index: number }) {
  const colors = ['#D4A853', '#B8860B', '#FFD700', '#22C55E', '#3B82F6', '#EF4444', '#A855F7'];
  const color = colors[index % colors.length];
  const randomX = (Math.random() - 0.5) * 500;
  const randomDelay = Math.random() * 0.5;
  const randomDuration = 2 + Math.random() * 2;
  const randomRotation = Math.random() * 720 - 360;
  const size = 6 + Math.random() * 8;
  const isCircle = Math.random() > 0.5;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: isCircle ? size : size * 0.4,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : '2px',
        top: '30%',
        left: '50%',
      }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
      animate={{
        x: randomX,
        y: [0, -200, 400],
        opacity: [1, 1, 0],
        rotate: randomRotation,
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
    />
  );
}

export default function OrderConfirmation({ isOpen, onClose, order }: OrderConfirmationProps) {
  const { clearCart } = useCart();

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const confettiParticles = useMemo(
    () => Array.from({ length: 40 }, (_, i) => i),
    []
  );

  if (!order) return null;

  const handleWhatsApp = () => {
    const whatsappUrl = buildWhatsAppUrl(
      order.orderId,
      order.customer,
      order.items,
      order.totalAmount
    );
    window.open(whatsappUrl, '_blank');
  };

  const handleContinueShopping = () => {
    clearCart();
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
          />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            {confettiParticles.map((i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </div>

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-6 space-y-6">
              {/* Success Icon */}
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                >
                  <motion.svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    />
                  </motion.svg>
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold text-[#0A0A0A] font-outfit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Order Placed Successfully!
                </motion.h2>
                <motion.p
                  className="text-sm text-gray-400 mt-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Thank you for your order
                </motion.p>
              </div>

              {/* Order Details Card */}
              <motion.div
                className="bg-[#F5F5F5] rounded-xl p-4 space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className="text-sm font-bold font-mono text-[#0A0A0A]">{order.orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <span className="text-sm text-gray-700">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Payment Status</span>
                  <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                    Pending Verification
                  </span>
                </div>
              </motion.div>

              {/* Customer Details Card */}
              <motion.div
                className="bg-[#F5F5F5] rounded-xl p-4 space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Customer Details
                </h3>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{order.customer.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+91 {order.customer.phone}</span>
                  </div>
                  {order.customer.email && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{order.customer.email}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                      {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Products Ordered */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Products Ordered
                </h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedStorage}`}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                          {item.selectedColor && ` · ${item.selectedColor}`}
                          {item.selectedStorage && ` · ${item.selectedStorage}`}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-800 flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t-2 border-gray-200">
                  <span className="text-base font-bold text-[#0A0A0A]">Total Amount</span>
                  <span className="text-xl font-bold text-[#D4A853]">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="space-y-3 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {/* WhatsApp Confirmation */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-xl shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Confirm Order on WhatsApp
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={handleContinueShopping}
                  className="w-full py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
