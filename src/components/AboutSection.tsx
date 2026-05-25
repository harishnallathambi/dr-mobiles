'use client';

import Image from 'next/image';

/* ── Data ──────────────────────────────────────────────────────── */

const specializations = [
  { icon: '📱', label: 'Smartphones & Accessories' },
  { icon: '🎧', label: 'Smart Gadgets' },
  { icon: '🔧', label: 'Mobile Services & Support' },
  { icon: '🛒', label: 'Online Electronic Shopping' },
];

const whyChooseUs = [
  { icon: '✓', label: 'Genuine Products' },
  { icon: '✓', label: 'Secure Shopping' },
  { icon: '✓', label: 'Affordable Prices' },
  { icon: '✓', label: 'Friendly Customer Support' },
  { icon: '✓', label: 'Fast Service' },
];

const stats = [
  { value: '500+', label: 'Products' },
  { value: '1000+', label: 'Customers' },
  { value: '5★', label: 'Rated' },
];

/* ── Component ─────────────────────────────────────────────────── */

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white" style={{ opacity: 1 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section badge ── */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#D4A853]/10 text-[#B8860B] border border-[#D4A853]/30
                           text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            About Us
          </span>
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-gray-900">
            Meet the{' '}
            <span style={{
              background: 'linear-gradient(135deg, #F0C040 0%, #D4A853 50%, #B8860B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              DR MOBILES
            </span>{' '}
            Story
          </h2>
          <div className="mt-3 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-[#D4A853] to-[#B8860B]" />
        </div>

        {/* ── Main grid — 3 cols on desktop ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ══ Column 1: Founder card ══ */}
          <div className="flex flex-col items-center">
            {/* Founder photo */}
            <div className="relative w-56 h-72 rounded-3xl overflow-hidden border-4 border-[#D4A853]/40
                            shadow-2xl shadow-[#D4A853]/20 mb-5 flex-shrink-0"
              style={{ opacity: 1 }}>
              <Image
                src="/images/founder-rajakumar.jpg"
                alt="Rajakumarsoundarrajan - Founder of DR MOBILES"
                width={500}
                height={600}
                unoptimized
                className="h-full w-full object-cover"
                style={{ opacity: 1 }}
                priority
              />
              {/* Gold overlay gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Founder name tag */}
            <div className="text-center bg-[#0A0A0A] rounded-2xl px-6 py-4 border border-[#D4A853]/30
                            shadow-lg w-full max-w-xs">
              <p className="font-outfit font-bold text-[#D4A853] text-lg leading-tight">
                Rajakumarsoundarrajan
              </p>
              <p className="text-gray-400 text-sm mt-1 font-medium">Founder, DR MOBILES</p>
              <div className="mt-3 h-px bg-gradient-to-r from-transparent via-[#D4A853]/40 to-transparent" />
              <p className="text-gray-500 text-xs mt-3">Est. December 3, 2025</p>
            </div>

            {/* Stats row */}
            <div className="flex gap-4 mt-5 w-full max-w-xs">
              {stats.map(({ value, label }) => (
                <div key={label}
                  className="flex-1 text-center bg-gray-50 border border-gray-200 rounded-xl py-3 px-2">
                  <div className="font-outfit text-lg font-bold text-[#D4A853]">{value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ══ Column 2: Story content ══ */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* Tagline */}
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#D4A853]/20 shadow-lg">
              <p className="text-gray-200 leading-relaxed text-sm">
                Welcome to <span className="text-[#D4A853] font-bold">DR MOBILES</span> — your trusted destination
                for smartphones, accessories, and smart gadgets.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm mt-3">
                Founded on <span className="text-white font-semibold">December 3, 2025</span> by{' '}
                <span className="text-[#D4A853] font-semibold">Rajakumarsoundarrajan</span>, DR MOBILES was created
                to provide genuine products, affordable pricing, and a simple online shopping experience for
                customers across India.
              </p>
            </div>

            {/* Specializations */}
            <div>
              <h3 className="font-outfit font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-[#D4A853] to-[#B8860B] inline-block" />
                We Specialize In
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {specializations.map(({ icon, label }) => (
                  <div key={label}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3
                               hover:border-[#D4A853]/40 hover:bg-[#D4A853]/5 transition-all duration-200">
                    <span className="text-lg leading-none">{icon}</span>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-[#D4A853]/10 to-[#B8860B]/5 border border-[#D4A853]/20
                            rounded-2xl p-5">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-[#B8860B]">Our mission</span> is to deliver quality technology
                products with trust, customer satisfaction, and reliable service.
              </p>
            </div>
          </div>

          {/* ══ Column 3: Why choose us + logo ══ */}
          <div className="flex flex-col gap-6">

            {/* Why choose us */}
            <div>
              <h3 className="font-outfit font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-[#D4A853] to-[#B8860B] inline-block" />
                Why Choose Us?
              </h3>
              <ul className="space-y-2.5">
                {whyChooseUs.map(({ icon, label }) => (
                  <li key={label}
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3
                               shadow-sm hover:shadow-md hover:border-[#D4A853]/40 transition-all duration-200">
                    <span className="w-6 h-6 rounded-full bg-[#D4A853] flex items-center justify-center
                                     text-black text-xs font-black flex-shrink-0">
                      {icon}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DR Mobiles logo card */}
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#D4A853]/30 shadow-xl
                            flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full border-4 border-[#D4A853] bg-black p-2 shadow-xl overflow-hidden mb-4" style={{ opacity: 1 }}>
                <Image
                  src="/images/dr-mobiles-logo.jpg"
                  alt="DR MOBILES Logo"
                  width={160}
                  height={160}
                  unoptimized
                  className="h-full w-full rounded-full object-cover"
                  style={{ opacity: 1 }}
                />
              </div>
              <p className="font-outfit font-bold text-[#D4A853] text-lg tracking-widest">DR MOBILES</p>
              <p className="text-gray-400 text-xs mt-1">Your Trusted Mobile Partner</p>
              <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-[#D4A853]/40 to-transparent" />

              {/* Brand info chips */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  ['🏷️', 'Brand', 'DR MOBILES'],
                  ['📅', 'Est.', 'Dec 3, 2025'],
                  ['🇮🇳', 'Region', 'India'],
                ].map(([emoji, key, val]) => (
                  <div key={key} className="text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">{emoji} {key}</div>
                    <div className="text-white text-xs font-semibold mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA button */}
            <a
              href="#contact"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold
                         bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-black
                         hover:shadow-lg hover:shadow-[#D4A853]/30 hover:-translate-y-0.5
                         transition-all duration-300"
            >
              Contact Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
