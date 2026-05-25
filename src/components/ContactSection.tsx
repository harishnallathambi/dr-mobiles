'use client';

import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';

export default function ContactSection() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}`;

  const cards = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M11.998 0C5.372 0 0 5.373 0 12c0 2.116.554 4.103 1.523 5.824L.057 23.882a.5.5 0 00.613.635l6.22-1.631A11.945 11.945 0 0011.998 24c6.626 0 12-5.373 12-12S18.624 0 11.998 0zm0 22c-1.891 0-3.666-.523-5.183-1.432l-.371-.222-3.845 1.009 1.025-3.749-.241-.386A10 10 0 012 12C2 6.477 6.477 2 11.998 2 17.52 2 22 6.477 22 12c0 5.522-4.48 10-10.002 10z"/>
        </svg>
      ),
      title: 'WhatsApp',
      value: siteConfig.whatsappNumber,
      btnLabel: 'Chat with Us',
      href: whatsappUrl,
      gradient: 'from-green-600 to-emerald-500',
      target: '_blank',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      value: siteConfig.phone,
      btnLabel: 'Call Now',
      href: `tel:${siteConfig.phone}`,
      gradient: 'from-blue-600 to-indigo-500',
      target: '_self',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      value: siteConfig.email,
      btnLabel: 'Send Email',
      href: `mailto:${siteConfig.email}`,
      gradient: 'from-purple-600 to-pink-500',
      target: '_blank',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Get in Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-yellow-600 to-amber-400 rounded-full mx-auto" />
          <p className="mt-4 text-gray-500">We're here to help you find the perfect device</p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-7 text-white shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="mb-4 opacity-90">{card.icon}</div>
              <h3 className="font-outfit text-lg font-bold mb-1">{card.title}</h3>
              <p className="text-white/80 text-sm mb-5 break-all">{card.value}</p>
              <a
                href={card.href}
                target={card.target}
                rel="noopener noreferrer"
                className="inline-block bg-white/20 hover:bg-white/30 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
              >
                {card.btnLabel}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 shadow p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Shop Address</p>
            <p className="text-gray-500 text-sm mt-0.5">{siteConfig.address}</p>
          </div>
          <a
            href={siteConfig.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm inline-flex items-center gap-1 flex-shrink-0"
          >
            View on Maps
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
