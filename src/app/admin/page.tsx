'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { categories } from '@/data/products';
import { useToast } from '@/components/Toast';

interface AdminProduct extends Product {
  adminId?: string;
}

const emptyForm: {
  name: string;
  brand: string;
  category: string;
  price: string;
  originalPrice: string;
  stockQuantity: string;
  description: string;
  offerBadge: string;
  image: string;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
} = {
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

const STORAGE_KEY = 'dr-mobiles-admin-products';

export default function AdminPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProducts(JSON.parse(saved));
    } catch {}
  }, []);

  function save(updated: AdminProduct[]) {
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.stockQuantity) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const product: AdminProduct = {
      id: editingId || `admin-${Date.now()}`,
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stockQuantity: Number(form.stockQuantity),
      description: form.description,
      offerBadge: form.offerBadge || undefined,
      image: form.image || '/images/products/placeholder.png',
      stockStatus: form.stockStatus,
      featured: false,
    };

    if (editingId) {
      save(products.map(p => p.id === editingId ? product : p));
      showToast('Product updated!', 'success');
    } else {
      save([...products, product]);
      showToast('Product added!', 'success');
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(product: AdminProduct) {
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

  function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    save(products.filter(p => p.id !== id));
    showToast('Product deleted', 'info');
  }

  function handleUpdateStock(id: string, qty: number) {
    save(products.map(p => p.id === id ? { ...p, stockQuantity: qty, stockStatus: qty === 0 ? 'out-of-stock' : qty <= 3 ? 'low-stock' : 'in-stock' } : p));
  }

  function handleExport() {
    navigator.clipboard.writeText(JSON.stringify(products, null, 2));
    showToast('Product JSON copied to clipboard!', 'success');
  }

  function handleImport() {
    try {
      const parsed = JSON.parse(importText);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      save([...products, ...arr]);
      setImportText('');
      setShowImport(false);
      showToast(`Imported ${arr.length} product(s)!`, 'success');
    } catch {
      showToast('Invalid JSON format', 'error');
    }
  }

  const stockColors: Record<string, string> = {
    'in-stock': 'text-emerald-600 bg-emerald-50',
    'low-stock': 'text-amber-600 bg-amber-50',
    'out-of-stock': 'text-red-600 bg-red-50',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-yellow-600/30 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-2xl font-bold text-yellow-400">DR Mobiles Admin</h1>
          <p className="text-gray-400 text-sm">Stock Manager</p>
        </div>
        <Link href="/" className="text-gray-400 hover:text-yellow-400 text-sm flex items-center gap-1 transition-colors">
          ← Back to Store
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {/* Stock Status */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Stock Status</label>
                  <select
                    value={form.stockStatus}
                    onChange={e => setForm(f => ({ ...f, stockStatus: e.target.value as Product['stockStatus'] }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
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
                  Admin Products ({products.length})
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => setShowImport(v => !v)} className="px-3 py-1.5 border border-gray-600 rounded-lg text-xs text-gray-400 hover:text-white transition-colors">
                    Import JSON
                  </button>
                  <button onClick={handleExport} className="px-3 py-1.5 bg-yellow-600/20 border border-yellow-600/50 rounded-lg text-xs text-yellow-400 hover:bg-yellow-600/30 transition-colors">
                    Export JSON
                  </button>
                </div>
              </div>

              {/* Import area */}
              {showImport && (
                <div className="mb-5 p-4 bg-gray-800 rounded-xl border border-gray-700">
                  <textarea
                    rows={4}
                    placeholder='Paste JSON array of products here...'
                    value={importText}
                    onChange={e => setImportText(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-600 focus:outline-none focus:border-yellow-500 resize-none mb-3"
                  />
                  <button onClick={handleImport} className="px-4 py-2 bg-yellow-600 text-gray-900 font-bold rounded-lg text-sm hover:bg-yellow-500 transition-colors">
                    Import
                  </button>
                </div>
              )}

              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-3">📦</div>
                  <p>No admin products yet. Add your first product!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3 border border-gray-700">
                      {/* Image */}
                      <div className="w-14 h-14 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).src = '/images/products/placeholder.png'; }} />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{product.name}</p>
                        <p className="text-gray-400 text-xs">{product.brand} · {product.category}</p>
                        <p className="text-yellow-400 text-sm font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                      {/* Stock inline edit */}
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockColors[product.stockStatus]}`}>
                          {product.stockStatus.replace('-', ' ')}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={product.stockQuantity}
                          onChange={e => handleUpdateStock(product.id, Number(e.target.value))}
                          className="w-16 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-center text-white focus:outline-none focus:border-yellow-500"
                        />
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
      </div>
    </div>
  );
}
