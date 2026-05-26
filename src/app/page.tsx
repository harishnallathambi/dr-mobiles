'use client';

import { useState } from 'react';
import { Product, CustomerDetails, Order } from '@/types';
import { generateOrderId } from '@/utils/helpers';
import { useCart } from '@/context/CartContext';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import OffersSection from '@/components/OffersSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import PaymentModal from '@/components/PaymentModal';
import OrderConfirmation from '@/components/OrderConfirmation';

export default function Home() {
  const { setIsCartOpen, clearCart, items, totalAmount } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  function handleViewDetails(product: Product) {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }

  function handleSearchProductSelect(product: Product) {
    setIsSearchOpen(false);
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }

  function handleCheckout() {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }

  function handleCheckoutSubmit(details: CustomerDetails) {
    setCustomerDetails(details);
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  }

  function handlePaymentComplete(order: any) {
    setCurrentOrder(order);
    setIsPaymentOpen(false);
    setIsOrderConfirmOpen(true);
    clearCart();
  }

  function handleOrderConfirmClose() {
    setIsOrderConfirmOpen(false);
    setCurrentOrder(null);
    setCustomerDetails(null);
  }

  return (
    <main>
      <Navbar onSearchOpen={() => setIsSearchOpen(true)} />
      <HeroSection />
      <ProductGrid onViewDetails={handleViewDetails} />
      <OffersSection />
      <AboutSection />
      <ContactSection />
      <Footer />

      {/* Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onProductSelect={handleSearchProductSelect}
      />
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
      <CartDrawer onCheckout={handleCheckout} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckoutSubmit}
      />
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        customer={customerDetails}
        onPaymentComplete={handlePaymentComplete}
      />
      <OrderConfirmation
        isOpen={isOrderConfirmOpen}
        onClose={handleOrderConfirmClose}
        order={currentOrder}
      />
    </main>
  );
}
