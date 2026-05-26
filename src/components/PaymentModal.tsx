'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { CustomerDetails, Order } from '@/types';
import { useCart } from '@/context/CartContext';
import { paymentOptions } from '@/config/site';
import { formatPrice, buildWhatsAppUrl, generateOrderId } from '@/utils/helpers';
import { useToast } from '@/components/Toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerDetails | null;
  onPaymentComplete: (order: Order) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({
  isOpen,
  onClose,
  customer,
  onPaymentComplete,
}: PaymentModalProps) {
  const { items, totalAmount } = useCart();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string>('razorpay'); // Default to Razorpay
  const [orderId] = useState(() => generateOrderId());
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedOption = paymentOptions.find((o) => o.id === selectedId) || { id: 'razorpay', label: 'Razorpay', accountHolder: '', qrImage: '' };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  async function createD1Order(paymentMethod: string) {
    if (!customer) return null;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          pincode: customer.pincode,
          notes: customer.orderNotes,
          items: items.map(item => ({
            product: { id: item.product.id, name: item.product.name, price: item.product.price, image: item.product.image },
            quantity: item.quantity
          })),
          subtotal: totalAmount,
          total: totalAmount,
          paymentMethod,
          paymentStatus: 'pending'
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.id; // Backend generated order ID
      }
    } catch (e) {
      console.error('Error creating order', e);
    }
    return null;
  }

  async function handleRazorpay() {
    setIsProcessing(true);
    
    // 1. Create order in D1
    const dbOrderId = await createD1Order('razorpay');
    if (!dbOrderId) {
      showToast('Failed to create order', 'error');
      setIsProcessing(false);
      return;
    }

    // 2. Create Razorpay order
    try {
      const rzpRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount * 100, // Razorpay takes amount in paise
          receipt: dbOrderId
        })
      });

      if (!rzpRes.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const rzpData = await rzpRes.json();

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC_RAZORPAY_KEY_ID in env
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'DR Mobiles',
        description: 'Payment for your order',
        image: '/images/logo.png',
        order_id: rzpData.id,
        handler: async function (response: any) {
          // 4. Verify payment
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: dbOrderId
              })
            });

            if (verifyRes.ok) {
              const finalOrder: Order = {
                orderId: dbOrderId,
                customer: customer!,
                items: [...items],
                totalAmount,
                paymentStatus: 'verified',
                createdAt: new Date().toISOString(),
              };
              onPaymentComplete(finalOrder);
            } else {
              showToast('Payment verification failed', 'error');
            }
          } catch (e) {
            showToast('Error verifying payment', 'error');
          }
        },
        prefill: {
          name: customer?.fullName,
          email: customer?.email,
          contact: customer?.phone
        },
        theme: {
          color: '#D4A853'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        showToast(`Payment Failed: ${response.error.description}`, 'error');
      });
      rzp.open();

    } catch (e: any) {
      showToast(e.message || 'Payment initiation failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  const handleWhatsApp = async () => {
    setIsProcessing(true);
    const dbOrderId = await createD1Order('whatsapp');
    setIsProcessing(false);

    if (!customer) return;
    const finalOrder: Order = {
      orderId: dbOrderId || orderId,
      customer: customer,
      items: [...items],
      totalAmount,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const url = buildWhatsAppUrl(
      finalOrder.orderId,
      customer,
      items,
      totalAmount,
      selectedOption.label,
      selectedOption.accountHolder,
    );
    window.open(url, '_blank');
    onPaymentComplete(finalOrder);
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
            className="relative z-10 w-full max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="bg-[#0A0A0A] rounded-t-2xl px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-[#D4A853] bg-black p-0.5 shadow-lg overflow-hidden flex-shrink-0">
                  <Image src="/images/dr-mobiles-logo.jpg" alt="DR MOBILES" width={80} height={80} unoptimized className="h-full w-full rounded-full object-cover" />
                </div>
                <div>
                  <p className="font-outfit font-bold text-[#D4A853] text-base leading-tight">DR MOBILES</p>
                  <p className="text-gray-400 text-xs">Complete Your Payment</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="bg-gradient-to-r from-[#D4A853]/15 to-[#B8860B]/10 border border-[#D4A853]/30 rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Amount</p>
                  <p className="font-outfit text-2xl font-bold text-[#0A0A0A] mt-0.5">{formatPrice(totalAmount)}</p>
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-[#F5F5F5] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Items</h3>
                  <span className="text-xs text-gray-400">{customer.fullName}</span>
                </div>
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedStorage}`} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[65%]">{item.product.name} × {item.quantity}</span>
                    <span className="font-semibold text-gray-800">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pb-1">
                <button
                  onClick={handleRazorpay}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <span>💳</span>
                  <span>{isProcessing ? 'Processing...' : 'Pay with Razorpay'}</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR OFFLINE</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  onClick={() => setSelectedId('gpay')}
                  className="w-full py-2.5 border-2 border-[#D4A853] text-[#B8860B] font-bold rounded-xl hover:bg-[#D4A853]/10 transition-all duration-300 text-sm"
                >
                  Show QR for Offline Payment
                </button>

                {selectedId === 'gpay' && (
                   <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center mt-3"
                 >
                   <div className="inline-flex items-center gap-2 bg-[#0A0A0A] text-[#D4A853] px-4 py-1.5 rounded-full text-xs font-bold mb-4">
                     <span>🏦</span><span>Offline Payment</span>
                   </div>
                   <p className="text-xs text-gray-500 mb-3">Make payment via UPI manually, then send us a message on WhatsApp to confirm.</p>
                   
                   <button
                    onClick={handleWhatsApp}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    <span>💬</span><span>Send Order on WhatsApp</span>
                  </button>
                 </motion.div>
                )}

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
