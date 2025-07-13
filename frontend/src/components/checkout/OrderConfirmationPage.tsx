'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { orderService } from '@/services/Api';

import {Order} from "@/types/api"

import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  AlertCircle,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId }) => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await orderService.getOrders();
        
        if (response.success && response.data) {
          const foundOrder = response.data.find(o => o._id === orderId);
          if (foundOrder) {
            setOrders([foundOrder]);
          } else {
            setError('Order not found');
          }
        } else {
          setError('Failed to fetch order details');
        }
      } catch {
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Order not found'}
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => router.push('/orders')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
              <p className="text-gray-600">Thank you for your order. We&apos;ll send you updates via email.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-lg font-semibold">{orders[0]._id}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getStatusColor(orders[0].status)}>
                    {orders[0].status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDate(orders[0].createdAt)}
                  </span>
                </div>
                
                {/* Status Timeline */}
                <div className="space-y-3">
                  {orders.map((status, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        status.status === orders[0].status ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Order Status: {status.status}</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(status.createdAt)}
                          </span>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>

                {orders[0].estimatedDelivery && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800">
                        Estimated delivery: {formatDate(orders[0].estimatedDelivery)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders[0].orderItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.title}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium">${item.product.price} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.totalPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{orders[0].shippingDetails[0].fullName}</p>
                  <p className="text-gray-600">{orders[0].shippingDetails[0].address}</p>
                  <p className="text-gray-600">
                    {orders[0].shippingDetails[0].city}, {orders[0].shippingDetails[0].state} {orders[0].shippingDetails[0].postalCode}
                  </p>
                  <p className="text-gray-600">{orders[0].shippingDetails[0].country}</p>
                  <div className="flex items-center space-x-4 mt-3 pt-3 border-t">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{orders[0].shippingDetails[0].phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{orders[0].user.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${orders[0].totalRevenue.toFixed(2)}</span>
                  </div>
                  {orders[0].codCharges > 0 && (
                    <div className="flex justify-between">
                      <span>COD Fee</span>
                      <span>${orders[0].codCharges.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${orders[0].totalRevenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium">{orders[0].paymentMethod.toUpperCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Button asChild className="w-full">
                <Link href="/orders">View All Orders</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>

            {/* Support */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Contact our customer support team for any questions about your order.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
