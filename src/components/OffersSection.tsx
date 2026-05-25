'use client';

import { motion } from 'framer-motion';

const offers = [
  {
    icon: '📱',
    title: 'Best Mobile Deals',
    description: 'Up to 25% off on latest smartphones',
    gradient: 'from-yellow-600 via-amber-500 to-yellow-400',
    href: '#products',
  },
  {
    icon: '🎧',
    title: 'Accessories Combo',
    description: 'Buy 2 accessories, get 10% off',
    gradient: 'from-purple-700 via-purple-500 to-blue-500',
    href: '#products',
  },
  {
    icon: '⚡',
    title: 'Charger + Cable Combo',
    description: 'Premium charging kit at ₹999',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
    href: '#products',
  },
  {
    icon: '🔄',
    title: 'Refurbished Deals',
    description: 'Certified phones starting ₹14,999',
    gradient: 'from-rose-600 via-pink-500 to-orange-400',
    href: '#products',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function OffersSection() {
  return (
    <section id="offers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            ✨ Today's Smart Deals
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-yellow-600 to-amber-400 rounded-full mx-auto" />
          <p className="mt-4 text-gray-500 text-base">Grab the best offers before they're gone</p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {offers.map((offer) => (
            <motion.a
              key={offer.title}
              href={offer.href}
              variants={item}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br ${offer.gradient} rounded-2xl p-6 cursor-pointer block shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="text-4xl mb-4">{offer.icon}</div>
              <h3 className="font-outfit text-xl font-bold text-white mb-2">{offer.title}</h3>
              <p className="text-white/80 text-sm mb-5 leading-relaxed">{offer.description}</p>
              <span className="inline-flex items-center gap-1 text-white font-semibold text-sm">
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
