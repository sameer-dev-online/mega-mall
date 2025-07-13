// Order-related types for the checkout system

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderPricing {
  subtotal: number;
  codFee: number;
  total: number;
}

export interface PaymentMethod {
  type: 'cod' | 'online';
  name: string;
  description: string;
  fee: number;
  available: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerInfo: ShippingAddress;
  items: OrderItem[];
  pricing: OrderPricing;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderStatus {
  current: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  history: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
  note?: string;
}

export interface CreateOrderRequest {
  customerInfo: ShippingAddress;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  data?: Order;
  message?: string;
  error?: string;
}

export interface OrderListResponse {
  success: boolean;
  data?: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
  error?: string;
}

// Form validation types
export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface CheckoutStep {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  current: boolean;
}

// Constants
export const COD_FEE = 50;

export const ORDER_STATUSES = {
  placed: 'Order Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
} as const;

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    type: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order is delivered to your doorstep',
    fee: COD_FEE,
    available: true,
  },
  {
    type: 'online',
    name: 'Online Payment',
    description: 'Credit Card, Debit Card, PayPal (Coming Soon)',
    fee: 0,
    available: false,
  },
];
