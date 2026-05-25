'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultProducts } from '@/data/products';
import { formatPrice } from '@/utils/helpers';
import type { Product } from '@/types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getAllProducts(): Product[] {
  let adminProducts: Product[] = [];
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('dr-mobiles-admin-products');
      if (raw) adminProducts = JSON.parse(raw);
    } catch {
      /* ignore */
    }
  }

  const mergedMap = new Map<string, Product>();
  defaultProducts.forEach((p) => mergedMap.set(p.id, p));
  adminProducts.forEach((p) => mergedMap.set(p.id, p));
  return Array.from(mergedMap.values());
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onProductSelect }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-focus */
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /* Close on Escape */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
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

  /* Filtered products */
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return getAllProducts().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex flex-col"
        >
          {/* ── Top bar ── */}
          <div className="flex items-center justify-between px-4 sm:px-8 pt-6 pb-2">
            <h2 className="text-white font-outfit text-lg font-semibold">Search Products</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10
                         transition-colors"
              aria-label="Close search"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Search input ── */}
          <div className="px-4 sm:px-8 py-4">
            <div className="max-w-2xl mx-auto relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product name, brand, or category..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10
                           focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/30
                           text-white placeholder-gray-500 outline-none transition-all text-base"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ── Results ── */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8">
            <div className="max-w-5xl mx-auto">
              {query.trim() && results.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <p className="text-gray-400 text-lg">No products found for &ldquo;{query}&rdquo;</p>
                  <p className="text-gray-600 text-sm mt-2">Try a different search term</p>
                </motion.div>
              )}

              {results.length > 0 && (
                <>
                  <p className="text-gray-500 text-sm mb-4">
                    {results.length} result{results.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {results.map((product, idx) => (
                      <motion.button
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => {
                          onProductSelect(product);
                          onClose();
                        }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-3 text-left
                                   hover:bg-white/10 hover:border-[#D4A853]/30 transition-all duration-200
                                   group flex flex-col"
                      >
                        {/* Image */}
                        <div className="aspect-[4/3] rounded-xl bg-white/5 overflow-hidden mb-3 flex items-center justify-center">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={160}
                            height={120}
                            className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Info */}
                        <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                          {product.brand}
                        </span>
                        <span className="text-sm font-semibold text-white mt-0.5 line-clamp-2 leading-snug">
                          {product.name}
                        </span>
                        <span className="text-[#D4A853] font-bold text-sm mt-auto pt-2">
                          {formatPrice(product.price)}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {!query.trim() && (
                <div className="text-center py-16">
                  <svg
                    className="w-16 h-16 text-gray-700 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg">Start typing to search products</p>
                  <p className="text-gray-700 text-sm mt-1">Search by name, brand, or category</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
