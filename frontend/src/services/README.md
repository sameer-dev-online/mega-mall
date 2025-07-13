# API Services Documentation

This directory contains all the API services for the Mega Mall e-commerce application. The services are organized by functionality and provide a clean interface to interact with your backend API.

## Structure

```
src/services/Api/
├── index.ts              # Main export file
├── adminService.ts       # Admin-related API calls
├── userService.ts        # User authentication and profile
├── productService.ts     # Product management and search
├── cartService.ts        # Shopping cart operations
├── orderService.ts       # Order management
└── messageService.ts     # Messaging system
```

## Setup

### Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Axios Configuration

The services use a pre-configured Axios instance with:
- Automatic token management
- Request/response interceptors
- Error handling
- Base URL configuration

## Usage Examples

### Import Services

```typescript
import {
  userService,
  productService,
  cartService,
  orderService,
  messageService,
  adminService
} from '@/services/Api';
```

### User Authentication

```typescript
// Sign up
const signUpData = {
  fullName: "John Doe",
  email: "john@example.com",
  password: "password123",
  confirmPassword: "password123"
};
const response = await userService.signUp(signUpData);

// Sign in
const signInData = {
  email: "john@example.com",
  password: "password123"
};
const loginResponse = await userService.signIn(signInData);

// Get user profile
const userProfile = await userService.getUser();

// Logout
await userService.logout();
```

### Product Operations

```typescript
// Get all products
const products = await productService.getAllProducts();

// Get products by category with pagination
const categoryProducts = await productService.getProductsByCategory({
  category: "mobile",
  page: 1,
  limit: 10,
  sortBy: "price",
  sortOrder: "asc"
});

// Search products
const searchResults = await productService.searchProducts("iPhone", { page: 1, limit: 12 });

// Get single product
const product = await productService.getProduct("productId");

// Add review
const reviewData = {
  rating: 5,
  comment: "Great product!"
};
await productService.addReview("productId", reviewData);
```

### Cart Management

```typescript
// Add to cart
await cartService.addToCart({
  productId: "productId",
  quantity: 2
});

// Get cart items
const cart = await cartService.getCartItems();

// Update quantity
await cartService.updateQuantity({
  productId: "productId",
  quantity: 3
});

// Remove product from cart
await cartService.removeProduct("productId");

// Calculate cart total
const total = cartService.calculateCartTotal(cart.items);
```

### Order Management

```typescript
// Place order
const orderData = {
  fullName: "John Doe",
  address: "123 Main St",
  phone: "1234567890",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  country: "USA",
  paymentMethod: "cod"
};
const order = await orderService.placeOrder(orderData);

// Get orders
const orders = await orderService.getOrders();

// Cancel order
await orderService.cancelOrder({
  orderId: "orderId",
  reason: "Changed my mind"
});
```

### Admin Operations

```typescript
// Admin login
const adminLogin = await adminService.login({
  email: "admin@example.com",
  password: "adminpass"
});

// Upload product
const productData = {
  title: "iPhone 13",
  description: "Latest iPhone",
  price: 999,
  category: "mobile",
  weight: "200g",
  stock: 50,
  images: [file1, file2] // File objects
};
await adminService.uploadProduct(productData);

// Update product
await adminService.updateProduct("productId", {
  title: "Updated Title",
  price: 899
});

// Delete product
await adminService.deleteProduct("productId");

// Get dashboard stats
const dashboard = await adminService.getDashboard();
```

### Messaging

```typescript
// Send message to admin
await messageService.sendMessageByUser({
  message: "I need help with my order"
});

// Get messages
const messages = await messageService.getMessages();

// Admin send message to user
await adminService.sendMessageToUser("userId", "How can I help you?");
```

## Error Handling

All services return a consistent response format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
```

Example error handling:

```typescript
try {
  const response = await userService.signIn(credentials);
  if (response.success) {
    // Handle success
    console.log(response.data);
  } else {
    // Handle API error
    console.error(response.message);
  }
} catch (error) {
  // Handle network or other errors
  console.error('Network error:', error);
}
```

## Utility Methods

Each service includes utility methods for common operations:

### Product Service
- `filterProducts()` - Filter products by criteria
- `sortProducts()` - Sort products by price, rating, or date
- `getCategories()` - Get unique categories
- `getPriceRange()` - Get min/max prices

### Cart Service
- `calculateCartTotal()` - Calculate total price
- `getTotalItems()` - Get total item count
- `validateCart()` - Validate cart before checkout

### Order Service
- `getOrdersByStatus()` - Filter orders by status
- `canCancelOrder()` - Check if order can be cancelled
- `getOrderStats()` - Get order statistics

### Message Service
- `sortMessagesByDate()` - Sort messages chronologically
- `groupMessagesByDate()` - Group messages by date
- `searchMessages()` - Search through messages

## TypeScript Support

All services are fully typed with TypeScript interfaces. Import types as needed:

```typescript
import { User, Product, Cart, Order, ApiResponse } from '@/services/Api';
```

## Authentication

The services automatically handle authentication tokens:
- Tokens are stored in localStorage on successful login
- Tokens are automatically included in requests
- Automatic logout on 401 responses
- Token cleanup on logout

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Loading States**: Use loading states in your components
3. **Type Safety**: Use the provided TypeScript interfaces
4. **Validation**: Validate data before sending to API
5. **Caching**: Consider implementing client-side caching for frequently accessed data

## Examples

See `src/examples/apiUsage.ts` for comprehensive usage examples of all services.
