CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price INTEGER NOT NULL,
  originalPrice INTEGER,
  stock INTEGER DEFAULT 0,
  description TEXT,
  image TEXT,
  offerBadge TEXT,
  status TEXT DEFAULT 'active',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customerName TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  pincode TEXT,
  notes TEXT,
  items TEXT NOT NULL, /* JSON array of items */
  subtotal INTEGER,
  total INTEGER NOT NULL,
  paymentMethod TEXT,
  paymentStatus TEXT DEFAULT 'pending',
  razorpayOrderId TEXT,
  razorpayPaymentId TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  totalOrders INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discountPercentage INTEGER,
  flatDiscount INTEGER,
  minOrderValue INTEGER,
  active BOOLEAN DEFAULT 1,
  expiryDate TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT,
  active BOOLEAN DEFAULT 1,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
