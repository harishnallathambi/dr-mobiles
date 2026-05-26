DROP TABLE IF EXISTS products;
CREATE TABLE products (
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

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
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
