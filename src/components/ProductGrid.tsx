'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { defaultProducts } from '@/data/products';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  onViewDetails: (product: Product) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function loadAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data: any[] = await res.json();
      return data.map(p => ({
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
        featured: true // Or mapped from DB if available
      })) as Product[];
    }
  } catch (error) {
    console.error('Failed to fetch from API, falling back to local data', error);
  }

  // Fallback to local storage (for old local tests) + defaults
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

function sortProducts(products: Product[], sortBy: string): Product[] {
  const copy = [...products];
  switch (sortBy) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'newest':
      return copy.reverse();
    case 'featured':
    default:
      return copy.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ProductGrid: React.FC<ProductGridProps> = ({ onViewDetails }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts);

  /* Fetch products on mount */
  useEffect(() => {
    loadAllProducts().then(setAllProducts);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'dr-mobiles-admin-products') {
        loadAllProducts().then(setAllProducts);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const displayProducts = useMemo(() => {
    let filtered = allProducts;
    if (activeCategory !== 'All') {
      filtered = allProducts.filter((p) => p.category === activeCategory);
    }
    return sortProducts(filtered, sortBy);
  }, [allProducts, activeCategory, sortBy]);

  return (
    <section id="products" className="py-16 sm:py-20 bg-[#F5F5F5]" style={{ opacity: 1 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center mb-10">
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-gray-900">
            Our Products
          </h2>
          <div className="mt-3 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-[#D4A853] to-[#B8860B]" />
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Browse our curated collection of premium mobile phones, accessories, and gadgets.
          </p>
        </div>

        {/* ── Category filter ── */}
        <div className="mb-8" id="categories">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* ── Product grid — plain div, no motion/AnimatePresence ── */}
        {displayProducts.length > 0 ? (
          <div
            className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            style={{ opacity: 1 }}
          >
            {displayProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20" style={{ opacity: 1 }}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
            <p className="text-gray-500 text-sm">
              Try selecting a different category or adjusting your filters.
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-4 px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r
                         from-[#D4A853] to-[#B8860B] text-white hover:shadow-lg
                         hover:shadow-[#D4A853]/25 transition-shadow"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
