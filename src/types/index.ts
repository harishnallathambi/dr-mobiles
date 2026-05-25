export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  offerBadge?: string;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockQuantity: number;
  warranty?: string;
  colors?: string[];
  storage?: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  orderNotes: string;
}

export interface Order {
  orderId: string;
  customer: CustomerDetails;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'verified';
  createdAt: string;
}
