'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
import { formatPrice, calculateDiscount, getStockStatusColor, getStockStatusText } from '@/utils/helpers';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [imgError, setImgError] = useState(false);

  const imgSrc = imgError ? '/images/products/placeholder.svg' : product.image;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? calculateDiscount(product.price, product.originalPrice)
      : 0;

  const isOutOfStock = product.stockStatus === 'out-of-stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div
      className="product-card group relative rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
      style={{ opacity: 1 }}
    >
      {/* ── Image area ── */}
      <div
        className="relative h-56 w-full bg-white flex items-center justify-center overflow-hidden"
        style={{ opacity: 1 }}
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          style={{ opacity: 1 }}
          onError={() => setImgError(true)}
        />

        {/* Offer badge */}
        {product.offerBadge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold
                       bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-white shadow-md z-10"
          >
            {product.offerBadge}
          </span>
        )}

        {/* Quick view — shown on hover */}
        <button
          onClick={() => onViewDetails(product)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md z-10
                     flex items-center justify-center text-gray-600 hover:text-[#D4A853]
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
          aria-label="Quick view"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* ── Details ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand · Category */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
            {product.brand}
          </span>
          <span className="text-neutral-300">·</span>
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
            {product.category}
          </span>
        </div>

        {/* Product name */}
        <h3 className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-neutral-950">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs font-semibold text-[#D4A853]">-{discount}%</span>
            </>
          )}
        </div>

        {/* Stock status */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${getStockStatusColor(product.stockStatus)}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.stockStatus === 'in-stock'
                  ? 'bg-emerald-500'
                  : product.stockStatus === 'low-stock'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            />
            {getStockStatusText(product.stockStatus)}
          </span>
        </div>

        {/* Push buttons to bottom */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold
                        transition-all duration-200 ${
                          isOutOfStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#D4A853] hover:bg-[#B8860B] text-black hover:shadow-lg hover:shadow-[#D4A853]/25'
                        }`}
            style={{ opacity: 1 }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <button
            onClick={() => onViewDetails(product)}
            className="px-3 py-2.5 rounded-xl text-sm font-semibold border border-gray-200
                       text-gray-600 hover:border-[#D4A853] hover:text-[#D4A853]
                       transition-colors duration-200"
            style={{ opacity: 1 }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
