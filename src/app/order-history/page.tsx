'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { D1Order } from '@/types';
import { useToast } from '@/components/Toast';

export default function OrderHistoryPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<D1Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setHasSearched(true);
      } else {
        showToast('Failed to fetch orders', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Navbar onSearchOpen={() => {}} />
      
      <div className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 sm:py-20 mt-16">
        <div className="text-center mb-10">
          <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-gray-900">Track Your Orders</h1>
          <div className="mt-3 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-[#D4A853] to-[#B8860B]" />
          <p className="mt-4 text-gray-500">Enter the phone number used during checkout to view your order history.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 mb-10 border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="tel"
              placeholder="Enter your phone number..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent transition-shadow"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gray-900 text-white font-semibold py-3 px-8 rounded-xl hover:bg-black transition-colors disabled:opacity-70 whitespace-nowrap"
            >
              {isLoading ? 'Searching...' : 'Track Orders'}
            </button>
          </form>
        </div>

        {hasSearched && (
          <div className="space-y-6">
            <h2 className="font-outfit text-2xl font-bold text-gray-900 mb-6">
              {orders.length === 0 ? 'No orders found' : `Your Orders (${orders.length})`}
            </h2>

            {orders.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 mb-4">We couldn't find any orders matching this phone number.</p>
                <Link href="/" className="text-[#D4A853] font-medium hover:underline">
                  Continue Shopping
                </Link>
              </div>
            )}

            {orders.map((order) => {
              const itemsList = JSON.parse(order.items || '[]');
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order ID</p>
                      <p className="font-mono text-sm text-gray-900">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="font-bold text-[#D4A853]">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                          order.paymentStatus === 'delivered' ? 'bg-blue-100 text-blue-700' :
                          order.paymentStatus === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Paid via {order.paymentMethod === 'razorpay' ? 'Razorpay' : order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100 border-t border-gray-100 pt-4">
                      {itemsList.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 py-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={item.product?.image || '/images/products/placeholder.svg'} alt={item.product?.name} className="w-12 h-12 object-contain" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 line-clamp-1">{item.product?.name}</p>
                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right font-medium text-gray-900">
                            ₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
