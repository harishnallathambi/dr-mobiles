// ============================================
// DR MOBILES - PRODUCT CATALOG
// ============================================
//
// 📦 HOW TO ADD A NEW PRODUCT:
//   1. Copy any product object below
//   2. Give it a unique 'id' (e.g., 'product-15')
//   3. Update the name, brand, category, price, etc.
//   4. Place the product image in: public/images/products/
//   5. Set the 'image' path to: '/images/products/your-image.png'
//
// 💰 HOW TO UPDATE PRICE:
//   - Change the 'price' field for the current selling price
//   - Change 'originalPrice' for the MRP / strikethrough price
//   - Remove 'originalPrice' if there's no discount
//
// 📊 HOW TO UPDATE STOCK:
//   - Set 'stockStatus' to: 'in-stock', 'low-stock', or 'out-of-stock'
//   - Set 'stockQuantity' to the number of units available
//
// 🖼️ HOW TO REPLACE IMAGES:
//   - Replace the image file at public/images/products/product-N.png
//   - Or update the 'image' path to your new filename
//
// 🏷️ HOW TO ADD OFFER BADGES:
//   - Set 'offerBadge' to a short string like '10% OFF', 'Best Seller', etc.
//   - Remove 'offerBadge' to show no badge
//
// ⭐ HOW TO FEATURE A PRODUCT ON THE HOMEPAGE:
//   - Set 'featured: true' on the product
//
// ============================================

import { Product } from '@/types';

export const defaultProducts: Product[] = [
  // ──────────────────────────────────────────
  // SMARTPHONES
  // ──────────────────────────────────────────
  {
    id: 'product-1',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 129999,
    originalPrice: 139999,
    description:
      'The Samsung Galaxy S24 Ultra features a stunning 6.8" Dynamic AMOLED display, powerful Snapdragon 8 Gen 3 processor, and the iconic S Pen. Capture breathtaking photos with the 200MP camera system.',
    image: '/images/products/product-1.png',
    offerBadge: '10% OFF',
    stockStatus: 'in-stock',
    stockQuantity: 15,
    warranty: '1 Year Brand Warranty',
    colors: ['Titanium Black', 'Titanium White', 'Titanium Blue', 'Titanium Yellow'],
    storage: ['256GB', '512GB', '1TB'],
    featured: true,
  },
  {
    id: 'product-2',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'Smartphones',
    price: 159999,
    originalPrice: 169999,
    description:
      'iPhone 15 Pro Max is built with aerospace-grade titanium and features the A17 Pro chip, a 48MP camera system with 5x optical zoom, and USB-C with USB 3 speeds. The ultimate iPhone experience.',
    image: '/images/products/product-2.png',
    offerBadge: 'Best Seller',
    stockStatus: 'in-stock',
    stockQuantity: 10,
    warranty: '1 Year Apple Warranty',
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    storage: ['256GB', '512GB', '1TB'],
    featured: true,
  },
  {
    id: 'product-3',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 64999,
    originalPrice: 69999,
    description:
      'The OnePlus 12 delivers flagship performance with Snapdragon 8 Gen 3, a 2K 120Hz ProXDR display, and Hasselblad-tuned cameras. Features 100W SUPERVOOC charging for all-day power.',
    image: '/images/products/product-3.png',
    stockStatus: 'in-stock',
    stockQuantity: 20,
    warranty: '1 Year Brand Warranty',
    colors: ['Flowy Emerald', 'Silky Black'],
    storage: ['256GB', '512GB'],
    featured: true,
  },
  {
    id: 'product-4',
    name: 'Redmi Note 13 Pro',
    brand: 'Xiaomi',
    category: 'Smartphones',
    price: 24999,
    originalPrice: 27999,
    description:
      'Redmi Note 13 Pro offers a premium experience with a 200MP camera, 120Hz AMOLED display, and Snapdragon 7s Gen 2. An unbeatable value-for-money champion in the mid-range segment.',
    image: '/images/products/product-4.png',
    offerBadge: 'Value Deal',
    stockStatus: 'in-stock',
    stockQuantity: 30,
    warranty: '1 Year Brand Warranty',
    colors: ['Midnight Black', 'Purple', 'Ocean Teal'],
    storage: ['128GB', '256GB'],
    featured: true,
  },
  {
    id: 'product-5',
    name: 'Samsung Galaxy A15',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 13999,
    originalPrice: 15999,
    description:
      'The Samsung Galaxy A15 brings a beautiful 6.5" Super AMOLED display and a 50MP triple camera to the budget segment. Great battery life and smooth One UI experience for everyday use.',
    image: '/images/products/product-5.png',
    stockStatus: 'low-stock',
    stockQuantity: 4,
    warranty: '1 Year Brand Warranty',
    colors: ['Blue Black', 'Blue', 'Light Blue', 'Yellow'],
    storage: ['128GB', '256GB'],
  },

  // ──────────────────────────────────────────
  // EARPHONES
  // ──────────────────────────────────────────
  {
    id: 'product-6',
    name: 'Apple AirPods Pro 2',
    brand: 'Apple',
    category: 'Earphones',
    price: 24999,
    originalPrice: 26900,
    description:
      'AirPods Pro 2 with the H2 chip deliver 2x more Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio. USB-C charging case with precision finding via Find My.',
    image: '/images/products/product-6.png',
    stockStatus: 'in-stock',
    stockQuantity: 25,
    warranty: '1 Year Apple Warranty',
    featured: true,
  },
  {
    id: 'product-7',
    name: 'boAt Rockerz 450',
    brand: 'boAt',
    category: 'Earphones',
    price: 1499,
    originalPrice: 2990,
    description:
      'boAt Rockerz 450 wireless headphones deliver powerful HD sound with 40mm drivers, up to 15 hours of playtime, and a comfortable padded design. Perfect for music lovers on a budget.',
    image: '/images/products/product-7.png',
    offerBadge: '50% OFF',
    stockStatus: 'in-stock',
    stockQuantity: 50,
    featured: true,
  },

  // ──────────────────────────────────────────
  // SMART WATCHES
  // ──────────────────────────────────────────
  {
    id: 'product-8',
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    category: 'Smart Watches',
    price: 41999,
    originalPrice: 44900,
    description:
      'Apple Watch Series 9 features the powerful S9 SiP, a magical Double Tap gesture, and the brightest Always-On Retina display ever. Advanced health monitoring with blood oxygen and ECG.',
    image: '/images/products/product-8.png',
    stockStatus: 'in-stock',
    stockQuantity: 12,
    warranty: '1 Year Apple Warranty',
    colors: ['Midnight', 'Starlight', 'Silver', 'Product Red'],
  },

  // ──────────────────────────────────────────
  // CHARGERS
  // ──────────────────────────────────────────
  {
    id: 'product-9',
    name: 'Samsung 25W Charger',
    brand: 'Samsung',
    category: 'Chargers',
    price: 1299,
    originalPrice: 1999,
    description:
      'Official Samsung 25W Super Fast Charger with USB-C to USB-C cable. Compatible with Galaxy S24, S23, and other Samsung devices that support 25W fast charging.',
    image: '/images/products/product-9.png',
    stockStatus: 'in-stock',
    stockQuantity: 40,
  },

  // ──────────────────────────────────────────
  // MOBILE CASES
  // ──────────────────────────────────────────
  {
    id: 'product-10',
    name: 'Spigen Tough Armor Case',
    brand: 'Spigen',
    category: 'Mobile Cases',
    price: 1499,
    originalPrice: 2499,
    description:
      'Spigen Tough Armor provides military-grade protection with Air Cushion Technology and a built-in kickstand. Dual-layer design absorbs heavy impacts while keeping your phone slim.',
    image: '/images/products/product-10.png',
    stockStatus: 'in-stock',
    stockQuantity: 35,
  },

  // ──────────────────────────────────────────
  // REFURBISHED PHONES
  // ──────────────────────────────────────────
  {
    id: 'product-11',
    name: 'iPhone 13 (Refurbished)',
    brand: 'Apple',
    category: 'Refurbished Phones',
    price: 39999,
    originalPrice: 59999,
    description:
      'Certified refurbished iPhone 13 in excellent condition. Features the A15 Bionic chip, dual 12MP camera system, and Super Retina XDR display. Fully tested with 6-month warranty.',
    image: '/images/products/product-11.png',
    offerBadge: 'Certified',
    stockStatus: 'low-stock',
    stockQuantity: 3,
    warranty: '6 Months Seller Warranty',
    colors: ['Midnight', 'Starlight', 'Blue'],
    storage: ['128GB', '256GB'],
  },

  // ──────────────────────────────────────────
  // ACCESSORIES
  // ──────────────────────────────────────────
  {
    id: 'product-12',
    name: 'Anker PowerBank 20000mAh',
    brand: 'Anker',
    category: 'Accessories',
    price: 2999,
    originalPrice: 4999,
    description:
      'Anker 20000mAh portable charger with dual USB-A and USB-C ports. Features PowerIQ technology for optimized charging speeds. Charge your phone up to 5 times on a single charge.',
    image: '/images/products/product-12.png',
    offerBadge: '40% OFF',
    stockStatus: 'in-stock',
    stockQuantity: 22,
    featured: true,
  },
  {
    id: 'product-13',
    name: 'Screen Guard Tempered Glass',
    brand: 'DR Mobiles',
    category: 'Accessories',
    price: 299,
    originalPrice: 599,
    description:
      'Premium 9H hardness tempered glass screen protector with oleophobic coating. Ultra-clear transparency with anti-fingerprint technology. Easy bubble-free installation kit included.',
    image: '/images/products/product-13.png',
    stockStatus: 'in-stock',
    stockQuantity: 100,
  },
  {
    id: 'product-14',
    name: 'USB-C to Lightning Cable',
    brand: 'DR Mobiles',
    category: 'Accessories',
    price: 799,
    originalPrice: 1299,
    description:
      'MFi-certified USB-C to Lightning cable with braided nylon design for extra durability. Supports fast charging up to 20W and high-speed data transfer. 1.2 meter length.',
    image: '/images/products/product-14.png',
    stockStatus: 'in-stock',
    stockQuantity: 60,
  },

  // ──────────────────────────────────────────
  // ➕ ADD YOUR NEW PRODUCTS BELOW
  // ──────────────────────────────────────────
  // Copy the template below, uncomment it, and fill in the details:
  //
  // {
  //   id: 'product-15',
  //   name: 'Your Product Name',
  //   brand: 'Brand',
  //   category: 'Smartphones',           // Pick from the categories array below
  //   price: 9999,                         // Selling price in ₹
  //   originalPrice: 12999,                // MRP / strikethrough price (optional)
  //   description: 'Product description goes here. Keep it 2-3 sentences.',
  //   image: '/images/products/product-15.png',
  //   offerBadge: '20% OFF',              // Optional - remove if no badge
  //   stockStatus: 'in-stock',            // 'in-stock' | 'low-stock' | 'out-of-stock'
  //   stockQuantity: 10,
  //   warranty: '1 Year Brand Warranty',  // Optional
  //   colors: ['Black', 'White'],         // Optional - for phones
  //   storage: ['128GB', '256GB'],        // Optional - for phones
  //   featured: false,                     // Set to true to show on homepage
  // },
];

// ============================================
// PRODUCT CATEGORIES
// ============================================
// Add new categories here if you introduce new product types.
// The 'All' category is always shown first in the shop filter.
// ============================================

export const categories = [
  'All',
  'Smartphones',
  'Accessories',
  'Chargers',
  'Earphones',
  'Smart Watches',
  'Mobile Cases',
  'Refurbished Phones',
  'Services',
];
