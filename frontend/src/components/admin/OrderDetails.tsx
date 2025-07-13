"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Order, UpdateDeliveryStatusData } from '@/types/api';
import { adminService } from '@/services/Api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  Phone,
  Mail,
  Printer,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onOrderUpdate: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onBack, onOrderUpdate }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    setIsUpdatingStatus(true);
    
    try {
      const updateData: UpdateDeliveryStatusData = {
        orderId: order._id,
        status: newStatus
      };

      const response = await adminService.changeDeliveryStatus(updateData);
      
      if (response.success) {
        toast.success('Order status updated successfully');
        onOrderUpdate();
      } else {
        toast.error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred while updating order status';
      toast.error(errorMessage);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const totalAmount = order.totalRevenue + order.codCharges;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
            <p className="text-muted-foreground">Order #{order._id.slice(-8)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrintOrder}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isUpdatingStatus}>
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusUpdate('pending')}>
                <Clock className="h-4 w-4 mr-2" />
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusUpdate('shipped')}>
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusUpdate('delivered')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusUpdate('cancelled')}>
                <XCircle className="h-4 w-4 mr-2" />
                Mark as Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order #{order._id.slice(-8)}</span>
              </CardTitle>
              <CardDescription>
                Placed on {formatDate(order.createdAt)}
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Items</p>
              <p className="text-2xl font-bold">{order.orderItems.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="text-lg font-medium">Cash on Delivery</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{order.user.fullName}</h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.user.email}</span>
                </div>
                {order.user.phoneNumber && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Customer since {formatDate(order.user.createdAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Shipping Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.shippingDetails[0] ? (
              <div className="space-y-2">
                {order.shippingDetails[0].address && (
                  <p className="font-medium">{order.shippingDetails[0].address}</p>
                )}
                <p>
                  {order.shippingDetails[0].city && `${order.shippingDetails[0].city}, `}
                  {order.shippingDetails[0].state && `${order.shippingDetails[0].state} `}
                  {order.shippingDetails[0].postalCode}
                </p>
                {order.shippingDetails[0].country && (
                  <p className="text-muted-foreground">{order.shippingDetails[0].country}</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No address information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>
            {order.orderItems.length} item(s) in this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                {item.product.images?.[0]?.url ? (
                  <Image
                    src={item.product.images[0]?.url}
                    alt={item.product.title}
                    width={64}
                    height={64}
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-semibold">{item.product.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.product.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm">Qty: {item.quantity}</span>
                    <span className="text-sm">Weight: {item.product.weight}</span>
                    <span className="text-sm">Category: {item.product.category}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.product.price)}</p>
                  <p className="text-sm text-muted-foreground">per item</p>
                  <p className="font-bold text-primary">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span>COD Charges</span>
              <span>{formatCurrency(order.codCharges)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Method: Cash on Delivery</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Payment will be collected upon delivery
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
          <CardDescription>Track the progress of this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            
            {order.status !== 'pending' && (
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.status === 'shipped' || order.status === 'delivered' 
                    ? 'bg-primary' 
                    : 'bg-muted'
                }`}>
                  <Truck className={`h-4 w-4 ${
                    order.status === 'shipped' || order.status === 'delivered'
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <p className="font-medium">Order Shipped</p>
                  <p className="text-sm text-muted-foreground">
                    {order.status === 'shipped' || order.status === 'delivered' 
                      ? 'In transit' 
                      : 'Pending shipment'}
                  </p>
                </div>
              </div>
            )}
            
            {order.status === 'delivered' && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Order Delivered</p>
                  <p className="text-sm text-muted-foreground">Successfully delivered</p>
                </div>
              </div>
            )}
            
            {order.status === 'cancelled' && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Order Cancelled</p>
                  <p className="text-sm text-muted-foreground">Order has been cancelled</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
