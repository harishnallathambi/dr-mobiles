'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, storage?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dr-mobiles-cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('dr-mobiles-cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = useCallback((product: Product, quantity = 1, color?: string, storage?: string) => {
    setItems(prev => {
      const key = `${product.id}-${color || ''}-${storage || ''}`;
      const existing = prev.find(i =>
        `${i.product.id}-${i.selectedColor || ''}-${i.selectedStorage || ''}` === key
      );
      if (existing) {
        return prev.map(i =>
          `${i.product.id}-${i.selectedColor || ''}-${i.selectedStorage || ''}` === key
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stockQuantity) }
            : i
        );
      }
      return [...prev, { product, quantity, selectedColor: color, selectedStorage: storage }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setItems(prev =>
        prev.map(i =>
          i.product.id === productId
            ? { ...i, quantity: Math.min(quantity, i.product.stockQuantity) }
            : i
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalAmount, isCartOpen, setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
