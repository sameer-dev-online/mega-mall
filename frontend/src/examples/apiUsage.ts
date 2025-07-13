// Example usage of the API services
import {
  userService,
  productService,
  cartService,
  orderService,
  messageService,
  adminService
} from '@/services/Api';

// Example: User Authentication
export const handleUserLogin = async (email: string, password: string) => {
  try {
    const response = await userService.signIn({ email, password });
    
    if (response.success) {
      console.log('Login successful:', response.data);
      // Token is automatically stored in localStorage
      return response.data;
    } else {
      console.error('Login failed:', response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Example: User Registration
export const handleUserRegistration = async (userData: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await userService.signUp(userData);
    
    if (response.success) {
      console.log('Registration successful:', response.data);
      return response.data;
    } else {
      console.error('Registration failed:', response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Example: Fetch Products with Pagination
export const fetchProductsWithPagination = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await productService.getProductsByCategory({
      page,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    
    if (response.success) {
      console.log('Products fetched:', response.data);
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Example: Add Product to Cart
export const addProductToCart = async (productId: string, quantity: number = 1) => {
  try {
    const response = await cartService.addToCart({ productId, quantity });
    
    if (response.success) {
      console.log('Product added to cart:', response.data);
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Example: Place Order
export const placeOrder = async (orderData: {
  fullName: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
}) => {
  try {
    // First validate cart
    const cartResponse = await cartService.getCartItems();
    if (!cartResponse.success || !cartResponse.data?.items.length) {
      throw new Error('Cart is empty');
    }

    // Validate cart items
    const validation = cartService.validateCart(cartResponse.data.items);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Place the order
    const response = await orderService.placeOrder(orderData);
    
    if (response.success) {
      console.log('Order placed successfully:', response.data);
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// Example: Search Products
export const searchProducts = async (query: string, page: number = 1) => {
  try {
    const response = await productService.searchProducts(query, { page, limit: 12 });
    
    if (response.success) {
      console.log('Search results:', response.data);
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Example: Send Message to Admin
export const sendMessageToAdmin = async (message: string) => {
  try {
    const response = await messageService.sendMessageByUser({ message });
    
    if (response.success) {
      console.log('Message sent:', response.data);
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Example: Admin Upload Product
export const adminUploadProduct = async (productData: {
  title: string;
  description: string;
  price: number;
  category: string;
  weight: string;
  stock: number;
  images: File[];
}) => {
  try {
    const response = await adminService.uploadProduct(productData);
    
    if (response.success) {
      console.log('Product uploaded:', response.data);
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error uploading product:', error);
    throw error;
  }
};

// Example: Get User Profile
export const getUserProfile = async () => {
  try {
    const response = await userService.getUser();
    
    if (response.success) {
      console.log('User profile:', response.data);
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Example: Update Cart Item Quantity
export const updateCartQuantity = async (productId: string, quantity: number) => {
  try {
    const response = await cartService.updateQuantity({ productId, quantity });
    
    if (response.success) {
      console.log('Cart updated:', response.data);
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

// Example: Get Order History
export const getOrderHistory = async () => {
  try {
    const response = await orderService.getOrders();
    
    if (response.success) {
      console.log('Order history:', response.data);
      // Sort orders by date (newest first)
      const sortedOrders = orderService.sortOrdersByDate(response.data || []);
      return sortedOrders;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};
