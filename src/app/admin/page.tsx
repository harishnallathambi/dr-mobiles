'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Product, D1Order } from '@/types';
import { categories } from '@/data/products';
import { useToast } from '@/components/Toast';

const emptyForm = {
  name: '',
  brand: '',
  category: 'Smartphones',
  price: '',
  originalPrice: '',
  stockQuantity: '',
  description: '',
  offerBadge: '',
  image: '',
  stockStatus: 'in-stock',
};

export default function AdminPage() {
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<D1Order[]>([]);
  
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth) {
      setIsAuthenticated(true);
      fetchProducts(auth);
      fetchOrders(auth);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password) {
      sessionStorage.setItem('admin_auth', password);
      setIsAuthenticated(true);
      fetchProducts(password);
      fetchOrders(password);
      showToast('Logged in successfully', 'success');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
    setProducts([]);
    setOrders([]);
  }

  function getAuth() {
    return sessionStorage.getItem('admin_auth') || '';
  }

  async function fetchProducts(auth: string) {
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${auth}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand || '',
          category: p.category || 'Accessories',
          price: p.price,
          originalPrice: p.originalPrice,
          description: p.description || '',
          image: p.image || '/images/products/placeholder.svg',
          offerBadge: p.offerBadge,
          stockStatus: p.stock > 0 ? (p.stock > 5 ? 'in-stock' : 'low-stock') : 'out-of-stock',
          stockQuantity: p.stock || 0,
        })));
      } else if (res.status === 401) {
        handleLogout();
        showToast('Session expired or invalid password', 'error');
      }
    } catch (e) {
      showToast('Failed to fetch products', 'error');
    }
  }

  async function fetchOrders(auth: string) {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${auth}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      showToast('Failed to fetch orders', 'error');
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Resize/Compress image before saving to DB
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setForm(f => ({ ...f, image: dataUrl }));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.stockQuantity) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: Number(form.stockQuantity),
      description: form.description,
      offerBadge: form.offerBadge || undefined,
      image: form.image || '/images/products/placeholder.svg',
      status: 'active'
    };

    const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuth()}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(`Product ${editingId ? 'updated' : 'added'} successfully!`, 'success');
        setForm(emptyForm);
        setEditingId(null);
        fetchProducts(getAuth());
      } else {
        showToast('Failed to save product', 'error');
      }
    } catch (e) {
      showToast('An error occurred', 'error');
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      stockQuantity: String(product.stockQuantity),
      description: product.description,
      offerBadge: product.offerBadge || '',
      image: product.image,
      stockStatus: product.stockStatus,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAuth()}` }
      });
      if (res.ok) {
        showToast('Product deleted', 'info');
        fetchProducts(getAuth());
      }
    } catch (e) {
      showToast('Failed to delete product', 'error');
    }
  }

  async function handleUpdateOrderStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuth()}` 
        },
        body: JSON.stringify({ paymentStatus: status })
      });
      if (res.ok) {
        showToast('Order status updated', 'success');
        fetchOrders(getAuth());
      }
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  }

  const stockColors: Record<string, string> = {
    'in-stock': 'text-emerald-600 bg-emerald-50',
    'low-stock': 'text-amber-600 bg-amber-50',
    'out-of-stock': 'text-red-600 bg-red-50',
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-yellow-600/30 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-outfit text-3xl font-bold text-yellow-400">Admin Login</h1>
            <p className="text-gray-400 mt-2">Enter your admin password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              autoFocus
            />
            <button type="submit" className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 text-gray-900 font-bold py-3 rounded-xl hover:from-yellow-500 hover:to-amber-400 transition-all shadow-lg">
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">
              ← Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-yellow-600/30 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit text-2xl font-bold text-yellow-400">DR Mobiles Admin</h1>
          <p className="text-gray-400 text-sm">Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
            Store
          </Link>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-medium">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button 
            className={`pb-3 px-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'products' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('products')}
          >
            Manage Products
          </button>
          <button 
            className={`pb-3 px-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'orders' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders History
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form — 2 cols */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="font-outfit text-lg font-semibold text-yellow-400 mb-5">
                  {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Image upload */}
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Product Image</label>
                    {form.image && (
                      <div className="w-20 h-20 bg-gray-800 rounded-xl mb-2 overflow-hidden">
                        <img src={form.image} alt="preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                      />
                      <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-xs text-gray-300 transition-colors">
                        Upload
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </div>
                  </div>

                  {[
                    { label: 'Product Name *', key: 'name', type: 'text', placeholder: 'e.g. Samsung Galaxy S24' },
                    { label: 'Brand', key: 'brand', type: 'text', placeholder: 'e.g. Samsung' },
                    { label: 'Price (₹) *', key: 'price', type: 'number', placeholder: '24999' },
                    { label: 'Original Price (₹)', key: 'originalPrice', type: 'number', placeholder: '29999' },
                    { label: 'Stock Quantity *', key: 'stockQuantity', type: 'number', placeholder: '10' },
                    { label: 'Offer Badge', key: 'offerBadge', type: 'text', placeholder: '10% OFF' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={(form as Record<string, string>)[field.key]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  ))}

                  {/* Category */}
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Product description..."
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-500 text-gray-900 font-bold py-2.5 rounded-xl hover:from-yellow-500 hover:to-amber-400 transition-all">
                      {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingId && (
                      <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-4 py-2.5 border border-gray-600 rounded-xl text-gray-400 hover:text-white transition-colors text-sm">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Products list — 3 cols */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-outfit text-lg font-semibold text-yellow-400">
                    Live Products ({products.length})
                  </h2>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-3">📦</div>
                    <p>No products in database yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1">
                    {products.map(product => (
                      <div key={product.id} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3 border border-gray-700">
                        {/* Image */}
                        <div className="w-14 h-14 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).src = '/images/products/placeholder.svg'; }} />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">{product.name}</p>
                          <p className="text-gray-400 text-xs">{product.brand} · {product.category}</p>
                          <p className="text-yellow-400 text-sm font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                        </div>
                        {/* Stock inline */}
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockColors[product.stockStatus]}`}>
                            Qty: {product.stockQuantity}
                          </span>
                        </div>
                        {/* Actions */}
                        <div className="flex flex-col gap-1">
                          <button onClick={() => handleEdit(product)} className="px-2.5 py-1 bg-blue-600/20 border border-blue-600/50 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="px-2.5 py-1 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h2 className="font-outfit text-lg font-semibold text-yellow-400 mb-5">
              Recent Orders ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-3">🛍️</div>
                <p>No orders placed yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-800/50 border-b border-gray-700">
                    <tr>
                      <th className="px-4 py-3">Order ID / Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
                      const itemsList = JSON.parse(order.items || '[]');
                      return (
                        <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-yellow-400">{order.id}</span>
                            <br/>
                            <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-white">{order.customerName}</span>
                            <br/>
                            <span className="text-xs text-gray-400">{order.phone}</span>
                            <br/>
                            <span className="text-xs text-gray-500 truncate max-w-[150px] block">{order.city}</span>
                          </td>
                          <td className="px-4 py-3 max-w-[200px]">
                            <div className="text-xs space-y-1">
                              {itemsList.map((item: any, idx: number) => (
                                <div key={idx} className="truncate">
                                  {item.quantity}x {item.product?.name || 'Unknown'}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-white">
                            ₹{order.total.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs uppercase bg-gray-800 px-2 py-1 rounded border border-gray-700">
                              {order.paymentMethod}
                            </span>
                            {order.razorpayPaymentId && (
                              <div className="text-[10px] text-gray-500 mt-1 font-mono">
                                {order.razorpayPaymentId}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              order.paymentStatus === 'paid' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' :
                              order.paymentStatus === 'failed' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                              'bg-amber-900/50 text-amber-400 border border-amber-800'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.paymentStatus}
                              onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-yellow-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="failed">Failed</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
