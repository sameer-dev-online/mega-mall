import axiosInstance from '@/lib/axious';
import {
  ApiResponse,
  Order,
  PlaceOrderData,
  CancelOrderData
} from '@/types/api';

class OrderService {
  // Order Management
  async placeOrder(data: PlaceOrderData): Promise<ApiResponse<Order>> {
    const response = await axiosInstance.post('/order/place-order', data);
    return response.data;
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    const response = await axiosInstance.get('/order/get-orders');
    return response.data;
  }

  async cancelOrder(data: CancelOrderData): Promise<ApiResponse> {
    const response = await axiosInstance.delete('/order/cancel-order-by-user', {
      data
    });
    return response.data;
  }

  // Utility methods for order management
  getOrdersByStatus(orders: Order[], status: Order['status']): Order[] {
    return orders.filter(order => order.status === status);
  }

  getOrderById(orders: Order[], orderId: string): Order | undefined {
    return orders.find(order => order._id === orderId);
  }

  calculateOrderTotal(order: Order): number {
    return order.orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getOrderStatusColor(status: Order['status']): string {
    const statusColors = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  }

  getOrderStatusText(status: Order['status']): string {
    const statusText = {
      pending: 'Pending',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusText[status] || 'Unknown';
  }

  canCancelOrder(order: Order): boolean {
    return ['pending', 'processing'].includes(order.status);
  }

  getEstimatedDeliveryDate(order: Order): Date | null {
    if (order.status === 'delivered') return null;
    
    const orderDate = new Date(order.createdAt);
    const estimatedDays = {
      pending: 7,
      processing: 5,
      shipped: 3,
      delivered: 0,
      cancelled: 0
    };
    
    const daysToAdd = estimatedDays[order.status] || 7;
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
    
    return estimatedDate;
  }

  formatOrderDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Order statistics
  getOrderStats(orders: Order[]): {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  } {
    const stats = {
      total: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0
    };

    orders.forEach(order => {
      stats[order.status]++;
      if (order.status !== 'cancelled') {
        stats.totalRevenue = order.totalRevenue;
      }
    });

    return stats;
  }

  // Sort orders by date (newest first by default)
  sortOrdersByDate(orders: Order[], ascending: boolean = false): Order[] {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  // Filter orders by date range
  filterOrdersByDateRange(orders: Order[], startDate: Date, endDate: Date): Order[] {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }
}

export const orderService = new OrderService();
