import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'DR Mobiles - Premium Mobiles, Accessories & Smart Deals',
  description: 'Shop trusted mobile phones, accessories, and gadgets with easy ordering and UPI payment. DR Mobiles offers genuine products, transparent pricing, and WhatsApp order support.',
  keywords: ['mobile phones', 'smartphones', 'accessories', 'chargers', 'earphones', 'smartwatch', 'DR Mobiles'],
  openGraph: {
    title: 'DR Mobiles - Premium Mobiles & Accessories',
    description: 'Your trusted mobile shop for phones, accessories, and gadgets.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans bg-white antialiased`}>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
