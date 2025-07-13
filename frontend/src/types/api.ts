// API Types and Interfaces

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

// User Types
export interface User {
  _id?: string;
  userId?: string;
  fullName: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      marketing?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private';
      showEmail?: boolean;
      showPhone?: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface emailUpdateData {
  newEmail: string
}

export interface updatePersonalInfoData {
   fullName: string,
    phoneNumber: string,
      dateOfBirth: string,
      gender: 'male' | 'female' | 'other' | 'prefer-not-to-say',
      address: {
        street: string,
        city: string,
        state: string,
        zipCode: string,
        country: string,
}
}

export interface UpdateProfileData {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      marketing?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private';
      showEmail?: boolean;
      showPhone?: boolean;
    };
  };
}

// Product Types
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  weight: string;
  stock: number;
  images: { url: string }[];
  reviews?: Review[];
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetALLProducts {
  products: Product[];
  totalPages: number;
  currentPage: number;
}



// Review Types
export interface Review {
  _id: string;
 rating: number;
  comment: string;
  fullName: string;
  avatar?: string;  
  createdAt: string;
}

export interface ReviewData {
  rating: number;
  comment: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  images: { url: string }[];
  stock: number;
  description: string;
  weight: string;
  category: string;
  totalPrice: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateQuantityData {
  productId: string;
  quantity: number;
}

// Cart Component Props Types
export interface CartItemProps {
  item: CartItem;
  onQuantityUpdate: (productId: string, quantity: number) => Promise<boolean>;
  onRemove: (productId: string) => Promise<boolean>;
  isUpdating: boolean;
}

export interface CartSummaryProps {
  cart: CartItem[] | null;
  onProceedToCheckout: () => void;
  isUpdating: boolean;
}

export interface EmptyCartProps {
  onContinueShopping: () => void;
}

// Cart Calculation Types
export interface CartCalculations {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// Order Types
export interface Order {
  _id: string;
  user: User;
  orderItems: OrderItems[];
  shippingDetails: ShippingAddress[];
  paymentMethod: string;
  totalRevenue: number;
  codCharges: number;
  status: 'pending' |  'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}
export interface OrderItems {
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
}
export interface ShippingAddress {
  fullName: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PlaceOrderData extends ShippingAddress {
  paymentMethod: string;
}

export interface CancelOrderData {
  orderId: string;
  reason: string;
}

export interface UpdateDeliveryStatusData {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

// Message Types
export interface Message {
  _id: string;
  sender: User;
  receiver?: User;
  message: string;
  isFromAdmin: boolean;
  isRead?: boolean;
  createdAt: string;
}

export interface SendMessageData {
  message: string;
}

// Admin Types
export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'superAdmin';
}
export interface AdminSignUpData {
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'superAdmin';
}

export interface TopSellingProduct {
  title: string;
  images: {url:string, _id:string}[];
  totalQuantity: number;
  totalRevenue: number;
}
export interface DashboardStats {
  totalUsers: number;
  totalSales: number;
  totalProducts: number;
  totalOrders: number;
  topSellingProduct: TopSellingProduct;
}

export interface GetAllAdmins {
  admins: Admin[];
  totalPages: number;
  currentPage: number;
}
export interface GetAllUsers {
  users: User[];
  totalPages: number;
  currentPage: number;
}
export interface GetAllOrders  {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  totalSales: number;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductQueryParams extends PaginationParams {
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
export interface ProductUploadData {
  title: string;
  description: string;
  price: number;
  category: string;
  weight: string;
  stock: number;
  images: File[];
}

export interface ProductUpdateData {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  weight?: string;
  stock?: number;
}
// Error Types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
