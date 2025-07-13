import axiosInstance from '@/lib/axious';
import {
  ApiResponse,
  AdminSignUpData,
  SignInData,
  ProductUploadData,
  ProductUpdateData,
  UpdateDeliveryStatusData,
  DashboardStats,
  Order,
  Product,
  Admin,
  User,
  GetAllUsers,
  GetAllOrders,
  GetAllAdmins
} from '@/types/api';

class AdminService {
  // Authentication
  async signUp(data: AdminSignUpData): Promise<ApiResponse> {
    const response = await axiosInstance.post('/admin/sign-up', data);
    return response.data;
  }

  async login(data: SignInData): Promise<ApiResponse> {
    const response = await axiosInstance.post('/admin/login', data);
    return response.data;
  }
  async logout(): Promise<void>{
    const response = await axiosInstance.post('/admin/logout');
    return response.data;
  }

  async getAdmin(): Promise<ApiResponse>  {
   const response = await axiosInstance.get("admin/get-admin");
   return response.data;
  }

  // Product Management
  async uploadProduct(data: ProductUploadData): Promise<ApiResponse<Product>> {
    const formData = new FormData();
    
    // Append text fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('weight', data.weight);
    formData.append('stock', data.stock.toString());
    
    // Append images
    data.images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axiosInstance.post('/admin/upload-product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateProduct(productId: string, data: ProductUpdateData): Promise<ApiResponse<Product>> {
    const response = await axiosInstance.patch(`/admin/update-product/${productId}`, data);
    return response.data;
  }

  async deleteProduct(productId: string): Promise<ApiResponse> {
    const response = await axiosInstance.delete(`/admin/delete-product/${productId}`);
    return response.data;
  }

  async suggestProductDetails(image: File): Promise<ApiResponse<{title: string; description: string}[]>> {
    const formData = new FormData();
    formData.append('image', image);

    const response = await axiosInstance.post('/admin/suggest-product-details', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Order Management
  async changeDeliveryStatus(data: UpdateDeliveryStatusData): Promise<ApiResponse> {
    const response = await axiosInstance.patch('/admin/change-delivery-status', data);
    return response.data;
  }

  async deleteOrder(orderId: string, message: string): Promise<ApiResponse> {
    const response = await axiosInstance.delete('/admin/delete-order', {
      data: { orderId, message }
    });
    return response.data;
  }

  async getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
    const response = await axiosInstance.get(`/admin/user-orders/${userId}`);
    return response.data;
  }

  async getAllOrders(): Promise<ApiResponse<GetAllOrders>> {
    const response = await axiosInstance.get('/admin/orders');
    return response.data;
  }

  // User Management
 
  async getAllUsers(): Promise<ApiResponse<GetAllUsers>> {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    const response = await axiosInstance.get(`/admin/user/${userId}`);
    return response.data;
  }

  // Admin User Management
  async getAllAdmins(): Promise<ApiResponse<GetAllAdmins>> {
    const response = await axiosInstance.get('/admin/admins');
    return response.data;
  }

  async deleteAdmin(adminId: string): Promise<ApiResponse> {
    const response = await axiosInstance.delete(`/delete-admin/${adminId}`);
    return response.data;
  }

  // Dashboard
  async getDashboard(): Promise<ApiResponse<DashboardStats>> {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  }

  // Message Management (Admin to User)
  async sendMessageToUser(userId: string, message: string): Promise<ApiResponse> {
    const response = await axiosInstance.post(`/message/send-message-by-admin/${userId}`, {
      message
    });
    return response.data;
  }
}

export const adminService = new AdminService();
