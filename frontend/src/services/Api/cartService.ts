import axiosInstance from '@/lib/axious';
import {
  ApiResponse,
  CartItem,
  AddToCartData,
  UpdateQuantityData
} from '@/types/api';

class CartService {
  // Cart Management
  async addToCart(data: AddToCartData): Promise<ApiResponse<CartItem[]>> {
    const response = await axiosInstance.post('/cart/add-to-cart', data);
    return response.data;
  }

  async getCartItems(): Promise<ApiResponse<CartItem[]>> {
    const response = await axiosInstance.get('/cart/get-cart-items');
    // console.log(response.data)
    return response.data;
  }

  async updateQuantity(data: UpdateQuantityData): Promise<ApiResponse<CartItem[]>> {
    const response = await axiosInstance.patch('/cart/toggle-quantity', data);
    return response.data;
  }

  async removeProduct(productId: string): Promise<ApiResponse<CartItem[]>> {
    const response = await axiosInstance.delete('/cart/remove-product', {
      data: { productId }
    });
    return response.data;
  }

  async clearCart(): Promise<ApiResponse> {
    // Note: This endpoint might not exist in your API, but it's a common feature
    // You might need to implement this on the backend
    const response = await axiosInstance.delete('/cart/clear');
    return response.data;
  }

  // Utility methods for cart calculations
  calculateCartTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  calculateItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  getTotalItems(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Check if product is in cart
  isProductInCart(cartItems: CartItem[], productId: string): boolean {
    return cartItems.some(item => item.productId === productId);
  }

  // Get cart item by product ID
  getCartItem(cartItems: CartItem[], productId: string): CartItem | undefined {
    return cartItems.find(item => item.productId === productId);
  }

  // Calculate shipping (you can customize this logic)
  calculateShipping(cartTotal: number, freeShippingThreshold: number = 50): number {
    return cartTotal >= freeShippingThreshold ? 0 : 10; // $10 shipping fee
  }

  // Calculate tax (you can customize this logic)
  calculateTax(cartTotal: number, taxRate: number = 0.08): number {
    return cartTotal * taxRate; // 8% tax rate
  }

  // Calculate final total including shipping and tax
  calculateFinalTotal(
    cartItems: CartItem[], 
    options: {
      freeShippingThreshold?: number;
      taxRate?: number;
    } = {}
  ): {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  } {
    const subtotal = this.calculateCartTotal(cartItems);
    const shipping = this.calculateShipping(subtotal, options.freeShippingThreshold);
    const tax = this.calculateTax(subtotal, options.taxRate);
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total
    };
  }

  // Validate cart before checkout
  validateCart(cartItems: CartItem[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (cartItems.length === 0) {
      errors.push('Cart is empty');
    }

    cartItems.forEach(item => {
      if (item.quantity <= 0) {
        errors.push(`Invalid quantity for ${item.title}`);
      }
      
      if (item.quantity > item.stock) {
        errors.push(`Not enough stock for ${item.title}. Available: ${item.stock}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const cartService = new CartService();
