// import { CartItem } from '@/types/api';
// import { Order, OrderItem, OrderPricing, ShippingAddress, FormErrors, COD_FEE } from '@/types/order';

// /**
//  * Convert cart items to order items format
//  */
// export const convertCartToOrderItems = (cartItems: CartItem[]): OrderItem[] => {
//   return cartItems.map((item) => ({
//     productId: item.productId,
//     productTitle: item.title,
//     productImage: item.images?.[0]?.url || '',
//     price: item.price,
//     quantity: item.quantity,
//     subtotal: item.totalPrice,
//   }));
// };

// /**
//  * Calculate order pricing including COD fees
//  */
// export const calculateOrderPricing = (
//   cartItems: CartItem[],
//   paymentMethod: 'cod' | 'online'
// ): OrderPricing => {
//   const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
//   const codFee = paymentMethod === 'cod' ? COD_FEE : 0;
//   const total = subtotal + codFee;

//   return {
//     subtotal,
//     codFee,
//     total,
//   };
// };

// /**
//  * Validate shipping address form
//  */
// export const validateShippingAddress = (address: Partial<ShippingAddress>): FormErrors => {
//   const errors: FormErrors = {};

//   // Required field validation
//   if (!address.fullName?.trim()) {
//     errors.fullName = 'Full name is required';
//   } else if (address.fullName.trim().length < 2) {
//     errors.fullName = 'Full name must be at least 2 characters';
//   }

//   if (!address.email?.trim()) {
//     errors.email = 'Email is required';
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
//     errors.email = 'Please enter a valid email address';
//   }

//   if (!address.phone?.trim()) {
//     errors.phone = 'Phone number is required';
//   } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(address.phone.replace(/\s/g, ''))) {
//     errors.phone = 'Please enter a valid phone number';
//   }

//   if (!address.address?.trim()) {
//     errors.address = 'Address is required';
//   } else if (address.address.trim().length < 5) {
//     errors.address = 'Address must be at least 5 characters';
//   }

//   if (!address.city?.trim()) {
//     errors.city = 'City is required';
//   } else if (address.city.trim().length < 2) {
//     errors.city = 'City must be at least 2 characters';
//   }

//   if (!address.state?.trim()) {
//     errors.state = 'State is required';
//   }

//   if (!address.zipCode?.trim()) {
//     errors.zipCode = 'ZIP code is required';
//   } else if (!/^\d{5}(-\d{4})?$/.test(address.zipCode.trim())) {
//     errors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
//   }

//   if (!address.country?.trim()) {
//     errors.country = 'Country is required';
//   }

//   return errors;
// };

// /**
//  * Check if form has any validation errors
//  */
// export const hasValidationErrors = (errors: FormErrors): boolean => {
//   return Object.keys(errors).length > 0;
// };

// /**
//  * Format order number for display
//  */
// export const formatOrderNumber = (orderId: string, orderNumber?: string): string => {
//   if (orderNumber) {
//     return orderNumber;
//   }
//   // Generate a formatted order number from ID
//   return `ORD-${orderId.slice(-8).toUpperCase()}`;
// };

// /**
//  * Calculate estimated delivery date
//  */
// export const calculateEstimatedDelivery = (orderDate: Date, businessDays: number = 5): Date => {
//   const deliveryDate = new Date(orderDate);
//   let daysAdded = 0;
  
//   while (daysAdded < businessDays) {
//     deliveryDate.setDate(deliveryDate.getDate() + 1);
//     // Skip weekends (Saturday = 6, Sunday = 0)
//     if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
//       daysAdded++;
//     }
//   }
  
//   return deliveryDate;
// };

// /**
//  * Format currency for display
//  */
// export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency,
//   }).format(amount);
// };

// /**
//  * Format date for display
//  */
// export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
//   const dateObj = typeof date === 'string' ? new Date(date) : date;
  
//   const defaultOptions: Intl.DateTimeFormatOptions = {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   };
  
//   return dateObj.toLocaleDateString('en-US', options || defaultOptions);
// };

// /**
//  * Get order status color for UI
//  */
// export const getOrderStatusColor = (status: string): string => {
//   switch (status) {
//     case 'placed':
//       return 'bg-blue-100 text-blue-800 border-blue-200';
//     case 'processing':
//       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//     case 'shipped':
//       return 'bg-purple-100 text-purple-800 border-purple-200';
//     case 'delivered':
//       return 'bg-green-100 text-green-800 border-green-200';
//     case 'cancelled':
//       return 'bg-red-100 text-red-800 border-red-200';
//     default:
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//   }
// };

// /**
//  * Check if order can be cancelled
//  */
// export const canCancelOrder = (order: Order): boolean => {
//   const cancellableStatuses = ['placed', 'processing'];
//   return cancellableStatuses.includes(order.status.current);
// };

// /**
//  * Generate order tracking steps
//  */
// export const getOrderTrackingSteps = (order: Order) => {
//   const allSteps = [
//     { status: 'placed', label: 'Order Placed', description: 'Your order has been received' },
//     { status: 'processing', label: 'Processing', description: 'We are preparing your order' },
//     { status: 'shipped', label: 'Shipped', description: 'Your order is on its way' },
//     { status: 'delivered', label: 'Delivered', description: 'Order delivered successfully' },
//   ];

//   const currentStatusIndex = allSteps.findIndex(step => step.status === order.status.current);
  
//   return allSteps.map((step, index) => ({
//     ...step,
//     completed: index <= currentStatusIndex,
//     current: step.status === order.status.current,
//     timestamp: order.status.history.find(h => h.status === step.status)?.timestamp,
//   }));
// };

// /**
//  * Validate cart before checkout
//  */
// export const validateCartForCheckout = (cart: CartItem[]): { isValid: boolean; errors: string[] } => {
//   const errors: string[] = [];

//   if (!cart || cart.length === 0) {
//     errors.push('Cart is empty');
//     return { isValid: false, errors };
//   }

//   // Check for out of stock items
//   const outOfStockItems = cart.filter(item => item.stock <= 0);
//   if (outOfStockItems.length > 0) {
//     errors.push(`Some items are out of stock: ${outOfStockItems.map(item => item.title).join(', ')}`);
//   }

//   // Check for quantity exceeding stock
//   const invalidQuantityItems = cart.filter(item => item.quantity > item.stock);
//   if (invalidQuantityItems.length > 0) {
//     errors.push(`Some items exceed available stock: ${invalidQuantityItems.map(item => item.title).join(', ')}`);
//   }

//   // Check for minimum order amount (if needed)
//   const totalAmount = cart.reduce((total, item) => total + item.totalPrice, 0);
//   const minimumOrderAmount = 10; // $10 minimum
//   if (totalAmount < minimumOrderAmount) {
//     errors.push(`Minimum order amount is ${formatCurrency(minimumOrderAmount)}`);
//   }

//   return {
//     isValid: errors.length === 0,
//     errors,
//   };
// };

// /**
//  * Generate order confirmation email data
//  */
// export const generateOrderConfirmationData = (order: Order) => {
//   return {
//     orderNumber: formatOrderNumber(order._id, order.orderNumber),
//     customerName: order.customerInfo.fullName,
//     customerEmail: order.customerInfo.email,
//     orderDate: formatDate(order.createdAt),
//     estimatedDelivery: order.estimatedDelivery ? formatDate(order.estimatedDelivery) : null,
//     items: order.items,
//     pricing: order.pricing,
//     shippingAddress: order.customerInfo,
//     paymentMethod: order.paymentMethod.name,
//   };
// };
