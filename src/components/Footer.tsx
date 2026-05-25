'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/site';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Offers', href: '#offers' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const categories = [
  'Smartphones', 'Accessories', 'Chargers', 'Earphones', 'Smart Watches', 'Mobile Cases',
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-yellow-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full border-2 border-[#D4A853] bg-black p-0.5 shadow-lg overflow-hidden flex-shrink-0">
                <Image
                  src={siteConfig.logo}
                  alt="DR MOBILES"
                  width={80}
                  height={80}
                  unoptimized
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <span className="font-outfit text-lg font-bold text-yellow-400 tracking-wider">DR MOBILES</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{siteConfig.description}</p>
            {/* Payment badge */}
            <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5">
              <span className="text-xs text-gray-400">Payments:</span>
              <span className="text-xs text-yellow-400 font-semibold">UPI · GPay · PhonePe</span>
            </div>
          </div>

          {/* Col 2 — Quick links */}
          <div>
            <h4 className="font-outfit text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Categories */}
          <div>
            <h4 className="font-outfit text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map(cat => (
                <li key={cat}>
                  <a href="#products" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="font-outfit text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {siteConfig.address}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${siteConfig.phone}`} className="hover:text-yellow-400 transition-colors">{siteConfig.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-yellow-400 transition-colors">{siteConfig.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor">
                  <path d="M11.998 0C5.372 0 0 5.373 0 12c0 2.116.554 4.103 1.523 5.824L.057 23.882a.5.5 0 00.613.635l6.22-1.631A11.945 11.945 0 0011.998 24c6.626 0 12-5.373 12-12S18.624 0 11.998 0zm0 22c-1.891 0-3.666-.523-5.183-1.432l-.371-.222-3.845 1.009 1.025-3.749-.241-.386A10 10 0 012 12C2 6.477 6.477 2 11.998 2 17.52 2 22 6.477 22 12c0 5.522-4.48 10-10.002 10z"/>
                </svg>
                <a href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">{siteConfig.whatsappNumber}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} DR Mobiles. All rights reserved.</p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Payments accepted via UPI / Google Pay
          </p>
        </div>
      </div>
    </footer>
  );
}
