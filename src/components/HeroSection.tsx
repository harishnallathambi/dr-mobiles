'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { siteConfig } from '@/config/site';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* ------------------------------------------------------------------ */
/*  Floating particles                                                 */
/* ------------------------------------------------------------------ */

interface Particle {
  id: number;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 4,
    duration: Math.random() * 6 + 6,
  }));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const HeroSection: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setParticles(generateParticles());
    setMounted(true);
  }, []);

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hi DR Mobiles! I\'m interested in your products.',
  )}`;

  const scrollToProducts = () => {
    const el = document.querySelector('#products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* ── Circuit pattern overlay ── */}
      <div className="circuit-bg absolute inset-0 opacity-[0.04] pointer-events-none" />

      {/* ── Radial gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,168,83,0.08) 0%, transparent 70%)',
        }}
      />

      {/* ── Floating gold particles — client-only to avoid hydration mismatch ── */}
      {mounted && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#D4A853]/20 pointer-events-none"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [0.2, 0.6, 0.3, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── Content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Logo with glow */}
        <motion.div variants={fadeUp} className="mb-8">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(212,168,83,0.15)',
                '0 0 60px rgba(212,168,83,0.25)',
                '0 0 30px rgba(212,168,83,0.15)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
          >
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-[#D4A853] bg-black p-1.5 shadow-xl overflow-hidden">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={160}
                height={160}
                unoptimized
                className="h-full w-full rounded-full object-cover"
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-outfit text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #FFFFFF 20%, #D4A853 50%, #B8860B 80%)',
            }}
          >
            Premium Mobiles, Accessories & Smart Deals
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          className="mt-5 sm:mt-6 text-gray-400 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed"
        >
          Shop trusted mobile phones, accessories, and gadgets with easy ordering and UPI payment.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          {/* Shop Now */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToProducts}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm
                       bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-gray-900
                       shadow-lg shadow-[#D4A853]/20 hover:shadow-[#D4A853]/30
                       transition-shadow duration-300"
          >
            Shop Now
          </motion.button>

          {/* WhatsApp */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(212,168,83,0.1)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm
                       border border-[#D4A853] text-[#D4A853]
                       hover:text-white transition-colors duration-300 text-center
                       flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact on WhatsApp
          </motion.a>
        </motion.div>
      </motion.div>

      {/* ── Bottom gold gradient line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A853]/50 to-transparent" />
    </section>
  );
};

export default HeroSection;
