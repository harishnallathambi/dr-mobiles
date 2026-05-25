import { siteConfig } from '@/config/site';
import { CartItem, CustomerDetails } from '@/types';

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DRM-${timestamp}-${random}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function buildWhatsAppUrl(
  orderId: string,
  customer: CustomerDetails,
  items: CartItem[],
  totalAmount: number,
  paymentMethod?: string,
  accountHolder?: string
): string {
  const itemsList = items
    .map(
      (item) =>
        `• ${item.product.name} x${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`
    )
    .join('\n');

  const message = `🛒 *New Order - DR MOBILES*\n\n` +
    `📋 *Order ID:* ${orderId}\n` +
    `👤 *Customer Name:* ${customer.fullName}\n` +
    `📱 *Phone:* +91 ${customer.phone}\n` +
    `📧 *Email:* ${customer.email || 'Not provided'}\n` +
    `📍 *Address:* ${customer.address}, ${customer.city} - ${customer.pincode}\n` +
    `📝 *Notes:* ${customer.orderNotes || 'None'}\n\n` +
    `🛍️ *Products Ordered:*\n${itemsList}\n\n` +
    `💰 *Total Amount:* ${formatPrice(totalAmount)}\n` +
    `💳 *Payment Method:* ${paymentMethod || 'UPI'}\n` +
    `🏦 *Account Holder:* ${accountHolder || 'DR MOBILES'}\n` +
    `✅ *Payment Status:* Pending Verification\n\n` +
    `Please confirm my order. Thank you! 🙏`;

  const encodedMessage = encodeURIComponent(message);
  const phone = siteConfig.whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export function getStockStatusColor(status: string): string {
  switch (status) {
    case 'in-stock': return 'text-emerald-500';
    case 'low-stock': return 'text-amber-500';
    case 'out-of-stock': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

export function getStockStatusText(status: string): string {
  switch (status) {
    case 'in-stock': return 'In Stock';
    case 'low-stock': return 'Low Stock';
    case 'out-of-stock': return 'Out of Stock';
    default: return 'Unknown';
  }
}
