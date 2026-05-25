'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { categories } from '@/data/products';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const categoryIcons: Record<string, string> = {
  All: '🔥',
  Smartphones: '📱',
  Tablets: '📟',
  Accessories: '🎧',
  Chargers: '🔌',
  Cases: '🛡️',
  'Screen Protectors': '🖥️',
  Earphones: '🎵',
  Smartwatches: '⌚',
  Powerbanks: '🔋',
  Cables: '🔗',
  Speakers: '🔊',
  Headphones: '🎧',
  'Phone Cases': '📦',
  Laptops: '💻',
  Gadgets: '🔧',
};

function getIcon(category: string): string {
  return categoryIcons[category] ?? '📦';
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  /* All categories (prepend "All") */
  const allCategories = ['All', ...categories.filter((c) => c !== 'All')];

  /* Check scroll overflow */
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  /* Close sort dropdown on outside click */
  useEffect(() => {
    if (!sortOpen) return;
    const handler = () => setSortOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [sortOpen]);

  return (
    <div className="flex items-center gap-3">
      {/* ── Scroll area ── */}
      <div className="relative flex-1 min-w-0">
        {/* Left fade / arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full
                       bg-gray-900/80 backdrop-blur border border-white/10 flex items-center justify-center
                       text-gray-400 hover:text-white hover:border-[#D4A853]/40 transition-colors shadow-lg"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                layout
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                            whitespace-nowrap transition-all duration-200 flex-shrink-0 border
                            ${
                              isActive
                                ? 'bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-gray-900 border-transparent shadow-md shadow-[#D4A853]/15'
                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-[#D4A853]/10 hover:text-[#B8860B] hover:border-[#D4A853]/30'
                            }`}
              >
                <span className="text-base leading-none">{getIcon(cat)}</span>
                {cat}
              </motion.button>
            );
          })}
        </div>

        {/* Right fade / arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full
                       bg-gray-900/80 backdrop-blur border border-white/10 flex items-center justify-center
                       text-gray-400 hover:text-white hover:border-[#D4A853]/40 transition-colors shadow-lg"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Sort dropdown ── */}
      <div className="relative flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSortOpen((prev) => !prev);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200
                     bg-white text-sm font-medium text-gray-700 hover:border-[#D4A853]/50
                     transition-colors"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <span className="hidden sm:inline">
            {sortOptions.find((o) => o.value === sortBy)?.label ?? 'Sort'}
          </span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {sortOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-200
                       shadow-xl py-1 z-20"
          >
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSortChange(opt.value);
                  setSortOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                            ${
                              sortBy === opt.value
                                ? 'bg-[#D4A853]/10 text-[#B8860B] font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
