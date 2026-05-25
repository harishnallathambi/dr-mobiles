'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { CustomerDetails } from '@/types';
import { useCart } from '@/context/CartContext';
import { siteConfig, paymentOptions } from '@/config/site';
import { formatPrice, buildWhatsAppUrl, generateOrderId } from '@/utils/helpers';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerDetails | null;
  onPaymentComplete: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  customer,
  onPaymentComplete,
}: PaymentModalProps) {
  const { items, totalAmount } = useCart();
  const [selectedId, setSelectedId] = useState<string>(paymentOptions[0].id);
  const [orderId] = useState(() => generateOrderId());

  const selectedOption = paymentOptions.find((o) => o.id === selectedId) ?? paymentOptions[0];

  /* Lock body scroll */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* WhatsApp send */
  const handleWhatsApp = () => {
    if (!customer) return;
    const url = buildWhatsAppUrl(
      orderId,
      customer,
      items,
      totalAmount,
      selectedOption.label,
      selectedOption.accountHolder,
    );
    window.open(url, '_blank');
  };

  if (!customer) return null;

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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="relative z-10 w-full max-w-md max-h-[92vh] overflow-y-auto
                       bg-white rounded-2xl shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* ── Header ── */}
            <div className="bg-[#0A0A0A] rounded-t-2xl px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-[#D4A853] bg-black p-0.5 shadow-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/dr-mobiles-logo.jpg"
                    alt="DR MOBILES"
                    width={80}
                    height={80}
                    unoptimized
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-outfit font-bold text-[#D4A853] text-base leading-tight">
                    DR MOBILES
                  </p>
                  <p className="text-gray-400 text-xs">Complete Your Payment</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                           text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* ── Total amount ── */}
              <div className="bg-gradient-to-r from-[#D4A853]/15 to-[#B8860B]/10
                              border border-[#D4A853]/30 rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Amount</p>
                  <p className="font-outfit text-2xl font-bold text-[#0A0A0A] mt-0.5">
                    {formatPrice(totalAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Order</p>
                  <p className="text-xs font-mono font-bold text-[#B8860B]">{orderId}</p>
                </div>
              </div>

              {/* ── Payment method selector ── */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                  Select Payment Method
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {paymentOptions.map((opt) => {
                    const isActive = selectedId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedId(opt.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200
                                    text-center ${isActive
                            ? 'border-[#D4A853] bg-[#D4A853]/10 shadow-md'
                            : 'border-gray-200 bg-white hover:border-[#D4A853]/40 hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <span className={`text-[11px] font-bold leading-tight ${isActive ? 'text-[#B8860B]' : 'text-gray-700'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[10px] leading-tight ${isActive ? 'text-[#D4A853]' : 'text-gray-400'}`}>
                          {opt.accountHolder}
                        </span>
                        {isActive && (
                          <span className="w-4 h-4 rounded-full bg-[#D4A853] flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── QR Code display ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center"
                >
                  {/* Account holder badge */}
                  <div className="inline-flex items-center gap-2 bg-[#0A0A0A] text-[#D4A853]
                                  px-4 py-1.5 rounded-full text-xs font-bold mb-4">
                    <span>🏦</span>
                    <span>Account Holder: {selectedOption.accountHolder}</span>
                  </div>

                  {/* QR Image */}
                  <div className="flex justify-center">
                    <div
                      className="relative w-56 h-56 rounded-2xl overflow-hidden border-4 border-[#D4A853] shadow-xl"
                      style={{ opacity: 1 }}
                    >
                      <Image
                        src={selectedOption.qrImage}
                        alt={`${selectedOption.label} QR Code — ${selectedOption.accountHolder}`}
                        fill
                        unoptimized
                        className="object-contain p-1"
                        style={{ opacity: 1 }}
                        priority
                      />
                    </div>
                  </div>

                  {/* Method label */}
                  <div className="mt-3">
                    <span className="inline-block bg-white border border-gray-200 rounded-lg px-3 py-1
                                     text-sm font-bold text-gray-800 shadow-sm">
                      {selectedOption.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Scan QR with your UPI app to pay
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* ── Order summary (compact) ── */}
              <div className="bg-[#F5F5F5] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Items</h3>
                  <span className="text-xs text-gray-400">{customer.fullName} • +91 {customer.phone}</span>
                </div>
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedStorage}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600 truncate max-w-[65%]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0A0A0A]">Total</span>
                  <span className="text-base font-bold text-[#D4A853]">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* ── Important note ── */}
              <div className="border-2 border-amber-400/40 bg-amber-50 rounded-xl p-4 flex gap-3">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <p className="text-xs text-amber-800 leading-relaxed">
                  After completing the payment, click{' '}
                  <strong>&quot;I Have Paid&quot;</strong> and send the order details on WhatsApp
                  for confirmation.
                </p>
              </div>

              {/* ── Action buttons ── */}
              <div className="space-y-3 pb-1">
                {/* I Have Paid */}
                <button
                  onClick={onPaymentComplete}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-black
                             font-bold rounded-xl shadow-lg shadow-[#D4A853]/30
                             hover:shadow-xl hover:shadow-[#D4A853]/40 hover:scale-[1.02]
                             active:scale-[0.98] transition-all duration-300 flex items-center
                             justify-center gap-2"
                >
                  <span>✅</span>
                  <span>I Have Paid</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold
                             rounded-xl shadow-lg shadow-[#25D366]/30 hover:shadow-xl
                             hover:shadow-[#25D366]/40 hover:scale-[1.02] active:scale-[0.98]
                             transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Send Order on WhatsApp</span>
                </button>

                {/* Cancel */}
                <button
                  onClick={onClose}
                  className="w-full py-3 border-2 border-gray-200 text-gray-500 font-medium rounded-xl
                             hover:border-gray-300 hover:text-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
