"use client";

import React, { useState, useEffect } from 'react';
import { adminService, orderService } from '@/services/Api';
import { ApiResponse, GetAllOrders, Order, UpdateDeliveryStatusData } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Filter,
  Eye,
  Package,
  AlertCircle,
  Calendar,
  User,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import OrderDetails from './OrderDetails';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  
  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      const response: ApiResponse<GetAllOrders> = await adminService.getAllOrders();
      
      if (response.success && response.data) {
        setOrders(response.data.orders);
        setTotalRevenue(response.data.totalSales);
      } else {
        setError(response.message || 'Failed to load orders');
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred while loading orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updateData: UpdateDeliveryStatusData = {
        orderId,
        status: newStatus
      };

      const response = await adminService.changeDeliveryStatus(updateData);
      
      if (response.success) {
        toast.success('Order status updated successfully');
        fetchOrders(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred while updating order status';
      toast.error(errorMessage);
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const response = await adminService.deleteOrder(orderId, 'Order deleted by admin');
      
      if (response.success) {
        toast.success('Order deleted successfully');
        fetchOrders(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to delete order');
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred while deleting order';
      toast.error(errorMessage);
    }
  };

  // Handle view order details
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleBackToOrderList = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdate = () => {
    fetchOrders(); // Refresh the orders list
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Get order statistics
  const orderStats = orderService.getOrderStats(orders);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };



  // Show order details if selected
  if (showOrderDetails && selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={handleBackToOrderList}
        onOrderUpdate={handleOrderUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
        <p className="text-muted-foreground">
          View and manage customer orders, update order status, and handle order-related tasks.
        </p>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orderStats.total}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered Orders</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <h4>Error loading orders</h4>
            <p>{error}</p>
          </div>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Orders List */}
      {!isLoading && !error && (
        <>
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedStatus 
                    ? 'No orders match your current filters.' 
                    : 'No orders have been placed yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={() => handleDeleteOrder(order._id)}
                  onViewDetails={() => handleViewOrderDetails(order)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Order Card Component
interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate, onDelete, onViewDetails }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  if(!order) {
    return <div>No orders found</div>
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-semibold text-lg">Order #{order._id.slice(-8)}</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {orderService.formatOrderDate(order.createdAt)}
                </p>
              </div>
              <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {order.user.fullName}
                </p>
                <p className="text-sm text-muted-foreground">{order.user.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="font-medium">{order.orderItems.length} item(s)</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-lg text-primary">
                  {formatCurrency(order.totalRevenue )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusUpdate(order._id, 'pending')}>
                  Mark as Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusUpdate(order._id, 'shipped')}>
                  Mark as Shipped
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusUpdate(order._id, 'delivered')}>
                  Mark as Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusUpdate(order._id, 'cancelled')}>
                  Mark as Cancelled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  Delete Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
