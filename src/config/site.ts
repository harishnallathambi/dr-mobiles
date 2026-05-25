// ============================================
// DR MOBILES - SITE CONFIGURATION
// ============================================
// Update these values to customize your store
// ============================================

export const siteConfig = {
  // --- STORE INFO ---
  name: 'DR Mobiles',
  tagline: 'Premium Mobiles, Accessories & Smart Deals',
  description: 'Shop trusted mobile phones, accessories, and gadgets with easy ordering and UPI payment.',
  about: 'Welcome to DR MOBILES — your trusted destination for smartphones, accessories, and smart gadgets. Founded on December 3, 2025 by Rajakumarsoundarrajan, DR MOBILES was created to provide genuine products, affordable pricing, and a simple online shopping experience for customers across India.',

  // --- CONTACT INFO ---
  // ⬇️ CHANGE YOUR WHATSAPP NUMBER HERE
  whatsappNumber: '+919344589006',
  phone: '+919344589006',
  email: 'drmobileshub35@gmail.com',
  address: '7, Veeran Kovil Street, Thirunallar, Karaikal 609607',

  // --- PAYMENT ---
  // ⬇️ CHANGE YOUR UPI ID HERE
  upiId: 'yourupiid@oksbi',
  // QR code image path (replace file at public/payment/gpay-qr.png)
  qrCodeImage: '/payment/gpay-qr.svg',

  // --- SOCIAL / LINKS ---
  googleMapsUrl: 'https://maps.google.com',

  // --- LOGO ---
  // ⬇️ Replace logo at public/images/logo.png
  logo: '/images/dr-mobiles-logo.jpg',
} as const;

/* ── Payment Options ─────────────────────────────────────────── */

export const paymentOptions = [
  {
    id: 'phonepe',
    label: 'PhonePe',
    accountHolder: 'Selvavaani',
    qrImage: '/payment/phonepe-qr.jpg',
    color: '#5F259F',
    icon: '📲',
  },
  {
    id: 'googlepay-selvarani',
    label: 'Google Pay',
    accountHolder: 'Selvarani',
    qrImage: '/payment/googlepay-selvarani-qr.jpg',
    color: '#1A73E8',
    icon: '💳',
  },
  {
    id: 'googlepay-soundarrajan',
    label: 'Google Pay Alternate',
    accountHolder: 'Soundarrajan',
    qrImage: '/payment/googlepay-soundarrajan-qr.jpg',
    color: '#34A853',
    icon: '💳',
  },
] as const;

export type PaymentOptionId = (typeof paymentOptions)[number]['id'];

