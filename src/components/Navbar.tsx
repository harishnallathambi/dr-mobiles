'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/site';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NavbarProps {
  onSearchOpen: () => void;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Categories', href: '#categories' },
  { label: 'Offers', href: '#offers' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const Navbar: React.FC<NavbarProps> = ({ onSearchOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  /* Track scroll position */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ────────── Navbar ────────── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* ── Left: Logo ── */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="flex items-center gap-2.5 flex-shrink-0"
            >
              <div className="h-10 w-10 rounded-full border-2 border-[#D4A853] bg-black p-0.5 shadow-lg overflow-hidden flex-shrink-0">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  width={80}
                  height={80}
                  unoptimized
                  className="h-full w-full rounded-full object-cover"
                  priority
                />
              </div>
              <span className="font-outfit text-lg md:text-xl font-bold tracking-wide text-[#D4A853]">
                DR MOBILES
              </span>
            </a>

            {/* ── Center: Desktop Links ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="relative px-3 py-2 text-sm font-medium text-gray-300 hover:text-white
                             transition-colors group"
                >
                  {link.label}
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded-full
                               bg-gradient-to-r from-[#D4A853] to-[#B8860B]
                               group-hover:w-4/5 transition-all duration-300"
                  />
                </a>
              ))}
            </div>

            {/* ── Right: Actions ── */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={onSearchOpen}
                className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10
                           transition-all duration-200"
                aria-label="Open search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10
                           transition-all duration-200"
                aria-label="Open cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold
                               w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-gray-900"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10
                           transition-all duration-200 ml-1"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <motion.span
                    animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    className="block h-0.5 w-full bg-current rounded-full origin-center"
                  />
                  <motion.span
                    animate={mobileOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                    className="block h-0.5 w-full bg-current rounded-full"
                  />
                  <motion.span
                    animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    className="block h-0.5 w-full bg-current rounded-full origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4A853]/40 to-transparent" />
      </motion.nav>

      {/* ────────── Mobile Drawer ────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-gray-900/98 backdrop-blur-2xl
                         border-l border-white/5 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
                <span className="font-outfit text-lg font-bold text-[#D4A853]">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white
                               hover:bg-white/5 transition-all duration-200 text-[15px] font-medium"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-white/5">
                <p className="text-xs text-gray-500 text-center">
                  © {new Date().getFullYear()} {siteConfig.name}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
