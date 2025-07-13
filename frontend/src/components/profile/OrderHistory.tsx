"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Package, Calendar,  Eye, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { orderService } from '@/services/Api';
import { toast } from 'react-toastify';
import { ApiResponse, Order } from '@/types/api';
import { AxiosError } from 'axios';
import Image from 'next/image';

interface OrderHistoryProps {
  className?: string;
}

export default function OrderHistory({ className = "" }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
   (async() => {
         setIsLoading(true);
      try {
        const response = await orderService.getOrders();
        if (response.success && response.data) {
          setOrders(response.data);
          toast.success(response.message)
        } 
      } catch (error: unknown) {
        const axiousError = error as AxiosError <ApiResponse>
        // console.log(error)
        toast.error(axiousError.response?.data.message || 'Failed to load order history. Please try again.');
      } finally {
        setIsLoading(false);
      }
   })
   ()
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await orderService.cancelOrder({
        orderId,
        reason: 'Cancelled by user'
      });

      if (response.success) {
        toast.success(response.message || 'Order cancelled successfully');
        setOrders(prev => prev.filter(order => order._id !== orderId));
      } else {
       toast.error(response.message || 'Failed to cancel order')
      }
    } catch (error: unknown) {
      if(error instanceof AxiosError) {
        toast.error(error.message || 'Failed to cancel order');
      }
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      shipped: { color: 'bg-purple-100 text-purple-800', text: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
     const Price = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
    return `+${Price}`;

  };

  const filteredOrders = orders
    .filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
     
      return matchesStatus;
    })
    .sort((a, b) => {
      const fieldA = sortBy === 'date' ? new Date(a.createdAt).getTime() : a.totalRevenue;
      const fieldB = sortBy === 'date' ? new Date(b.createdAt).getTime() : b.totalRevenue;
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex orderItems-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading order history...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex orderItems-center">
            <Package className="w-5 h-5 mr-2" />
            Order History
          </CardTitle>
          <CardDescription>View and manage your order history</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort as 'date' | 'amount');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:orderItems-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex orderItems-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex orderItems-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div>
                          {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''} • {formatPrice(order.totalRevenue)}
                        </div>
                        <div className="text-xs">
                          {order.orderItems?.slice(0, 2).map(item => item.product.title).join(', ')}
                          {order.orderItems?.length > 2 && ` +${order.orderItems.length - 2} more`}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>

                      {orderService?.canCancelOrder?.(order) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex orderItems-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex orderItems-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowOrderDetails(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Order Status</h3>
                  <div className="flex orderItems-center gap-2">
                    {getStatusBadge(selectedOrder.status)}
                    <span className="text-sm text-gray-600">
                      Ordered on {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">orderItems ({selectedOrder.orderItems.length})</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} className="flex orderItems-center gap-3 p-3 border rounded-lg">
                        {item.product.images?.[0] && (
                          <Image
                            src={item.product.images[0].url as string}
                            width={400}
                            height={400}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.title}</h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.shippingDetails[0].fullName}</p>
                    <p>{selectedOrder.shippingDetails[0].address}</p>
                    <p>
                      {selectedOrder.shippingDetails[0].city}, {selectedOrder.shippingDetails[0].state} {selectedOrder.shippingDetails[0].postalCode}
                    </p>
                    <p>{selectedOrder.shippingDetails[0].country}</p>
                    <p>Phone: {selectedOrder.shippingDetails[0].phone}</p>
                  </div>
                </div>
                 <div className="flex justify-between orderItems-center">
                    
                    <span className="font-medium">COD Charges</span>
                    <span className="text-lg font-semibold">
                      {`+$${selectedOrder.codCharges}`}
                    </span>
                  </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between orderItems-center">
                    
                    <span className="font-medium">Total Amount</span>
                    <span className="text-lg font-semibold">
                      {`$${selectedOrder.totalRevenue}`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Payment Method: {selectedOrder.paymentMethod.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
