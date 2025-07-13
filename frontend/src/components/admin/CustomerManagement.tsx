"use client";

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/Api';
import { User, Order, ApiResponse, GetAllUsers } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Filter,
  Eye,
  Users,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ShoppingBag,
  MoreHorizontal,
  UserCheck,
  UserX
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface CustomerManagementProps {}

const CustomerManagement: React.FC<CustomerManagementProps> = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      // Note: This endpoint might not exist in the backend yet
      // In a real implementation, you would need to add this endpoint
      const response: ApiResponse<GetAllUsers> = await adminService.getAllUsers();
      
      if (response.success && response.data) {
        setCustomers(response.data.users);
      } else {
        setError(response.message || 'Failed to load customers');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred while loading customers';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customer orders
  const fetchCustomerOrders = async (userId: string) => {
    try {
      setLoadingOrders(true);
      const response = await adminService.getUserOrders(userId);
      
      if (response.success && response.data) {
        setCustomerOrders(response.data);
      } else {
        setCustomerOrders([]);
        toast.error(response.message || 'Failed to load customer orders');
      }
    } catch (error: any) {
      setCustomerOrders([]);
      const errorMessage = error.response?.data?.message || 'An error occurred while loading customer orders';
      toast.error(errorMessage);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Handle customer selection
  const handleViewCustomer = (customer: User) => {
    setSelectedCustomer(customer);
    if (customer._id) {
      fetchCustomerOrders(customer._id);
    }
  };

  // Handle send message
  const handleSendMessage = async (userId: string) => {
    const message = prompt('Enter your message to the customer:');
    if (!message || !message.trim()) return;

    try {
      const response = await adminService.sendMessageToUser(userId, message.trim());
      
      if (response.success) {
        toast.success('Message sent successfully');
      } else {
        toast.error(response.message || 'Failed to send message');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred while sending message';
      toast.error(errorMessage);
    }
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.fullName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      (customer.phoneNumber && customer.phoneNumber.toLowerCase().includes(searchLower))
    );
  });

  // Customer statistics
  const customerStats = {
    total: customers.length,
    verified: customers.filter(c => c.isVerified).length,
    unverified: customers.filter(c => !c.isVerified).length,
    withOrders: customers.filter(c => c._id).length // This would need proper calculation
  };

  if (selectedCustomer) {
    return (
      <CustomerDetails
        customer={selectedCustomer}
        orders={customerOrders}
        loadingOrders={loadingOrders}
        onBack={() => setSelectedCustomer(null)}
        onSendMessage={() => selectedCustomer._id && handleSendMessage(selectedCustomer._id)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
        <p className="text-muted-foreground">
          View and manage customer accounts, orders, and support requests.
        </p>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customerStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified Accounts</p>
                <p className="text-2xl font-bold text-green-600">{customerStats.verified}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unverified Accounts</p>
                <p className="text-2xl font-bold text-yellow-600">{customerStats.unverified}</p>
              </div>
              <UserX className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold text-blue-600">{customerStats.withOrders}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
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
            <h4>Error loading customers</h4>
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

      {/* Customers List */}
      {!isLoading && !error && (
        <>
          {filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No customers found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'No customers match your search criteria.' 
                    : 'No customers have registered yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer._id || customer.email}
                  customer={customer}
                  onView={() => handleViewCustomer(customer)}
                  onSendMessage={() => customer._id && handleSendMessage(customer._id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Customer Card Component
interface CustomerCardProps {
  customer: User;
  onView: () => void;
  onSendMessage: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onView, onSendMessage }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <Users className="h-6 w-6 text-primary" />
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">{customer.fullName}</h3>
                <Badge variant={customer.isVerified ? 'default' : 'secondary'}>
                  {customer.isVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {customer.email}
                </span>
                {customer.phoneNumber && (
                  <span className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {customer.phoneNumber}
                  </span>
                )}
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {formatDate(customer.createdAt)}
                </span>
              </div>
              
              {customer.address && (
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {customer.address.city}, {customer.address.state}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onView}>
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
                <DropdownMenuItem onClick={onSendMessage}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onView}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Customer Details Component
interface CustomerDetailsProps {
  customer: User;
  orders: Order[];
  loadingOrders: boolean;
  onBack: () => void;
  onSendMessage: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  orders,
  loadingOrders,
  onBack,
  onSendMessage
}) => {
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

  const totalSpent = orders.reduce((sum, order) => sum + order.totalRevenue + order.codCharges, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Customers
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{customer.fullName}</h1>
            <p className="text-muted-foreground">Customer Details</p>
          </div>
        </div>
        <Button onClick={onSendMessage}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {customer.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <Users className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-xl">{customer.fullName}</h3>
                <Badge variant={customer.isVerified ? 'default' : 'secondary'}>
                  {customer.isVerified ? 'Verified Account' : 'Unverified Account'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              {customer.phoneNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{customer.phoneNumber}</p>
                </div>
              )}
              {customer.dateOfBirth && (
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{formatDate(customer.dateOfBirth)}</p>
                </div>
              )}
              {customer.gender && (
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{customer.gender.replace('-', ' ')}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatDate(customer.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.address ? (
              <div className="space-y-3">
                {customer.address.street && (
                  <div>
                    <p className="text-sm text-muted-foreground">Street Address</p>
                    <p className="font-medium">{customer.address.street}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {customer.address.city && (
                    <div>
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="font-medium">{customer.address.city}</p>
                    </div>
                  )}
                  {customer.address.state && (
                    <div>
                      <p className="text-sm text-muted-foreground">State</p>
                      <p className="font-medium">{customer.address.state}</p>
                    </div>
                  )}
                  {customer.address.zipCode && (
                    <div>
                      <p className="text-sm text-muted-foreground">ZIP Code</p>
                      <p className="font-medium">{customer.address.zipCode}</p>
                    </div>
                  )}
                  {customer.address.country && (
                    <div>
                      <p className="text-sm text-muted-foreground">Country</p>
                      <p className="font-medium">{customer.address.country}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No address information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            {orders.length} orders • Total spent: {formatCurrency(totalSpent)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingOrders ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No orders found for this customer.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} • {order.orderItems.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.totalRevenue + order.codCharges)}</p>
                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
