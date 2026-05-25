'use client';

import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </CartProvider>
  );
}
