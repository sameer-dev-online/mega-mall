"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { adminService } from '@/services/Api';
import { DashboardStats } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Activity,
  Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import { SimpleBarChart, SimpleProgressChart, SimpleLineChart } from './SimpleChart';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, trend }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend.isPositive ? '+' : ''}{trend.value}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getDashboard();
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.message || 'Failed to load dashboard data');
        }
      } catch (error) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred while loading dashboard';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <div>
          <h4>Error loading dashboard</h4>
          <p>{error}</p>
        </div>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <div>
          <h4>No data available</h4>
          <p>Dashboard statistics are not available at the moment.</p>
        </div>
      </Alert>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          description="Registered customers"
          icon={Users}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          description="Products in inventory"
          icon={Package}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          description="Orders processed"
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalSales)}
          description="Total sales revenue"
          icon={DollarSign}
        />
      </div>

      {/* Top Selling Product */}
      {stats.topSellingProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Product</CardTitle>
            <CardDescription>Best performing product this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {stats.topSellingProduct.images?.[0]?.url && (
                <Image
                  src={stats.topSellingProduct.images[0].url}
                  alt={stats.topSellingProduct.title}
                  width={64}
                  height={64}
                  className="object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{stats.topSellingProduct.title}</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity Sold</p>
                    <p className="font-medium">{stats.topSellingProduct.totalQuantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue Generated</p>
                    <p className="font-medium">{formatCurrency(stats.topSellingProduct.totalRevenue)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sample Sales Data */}
        <SimpleLineChart
          title="Sales Trend"
          description="Sales performance over the last 7 days"
          data={[
            { label: 'Mon', value: 1200 },
            { label: 'Tue', value: 1800 },
            { label: 'Wed', value: 1600 },
            { label: 'Thu', value: 2200 },
            { label: 'Fri', value: 2800 },
            { label: 'Sat', value: 3200 },
            { label: 'Sun', value: 2400 }
          ]}
        />

        {/* Order Status Distribution */}
        <SimpleProgressChart
          title="Order Status Distribution"
          description="Current order status breakdown"
          data={[
            { label: 'Delivered', value: stats.totalOrders * 0.6, color: 'bg-green-500' },
            { label: 'Shipped', value: stats.totalOrders * 0.2, color: 'bg-blue-500' },
            { label: 'Processing', value: stats.totalOrders * 0.15, color: 'bg-yellow-500' },
            { label: 'Pending', value: stats.totalOrders * 0.05, color: 'bg-red-500' }
          ]}
        />
      </div>

      {/* Category Performance */}
      <SimpleBarChart
        title="Category Performance"
        description="Sales by product category"
        data={[
          { label: 'Electronics', value: 45000, color: 'bg-blue-500' },
          { label: 'Clothing', value: 32000, color: 'bg-green-500' },
          { label: 'Home & Garden', value: 28000, color: 'bg-purple-500' },
          { label: 'Sports', value: 22000, color: 'bg-orange-500' },
          { label: 'Books', value: 15000, color: 'bg-pink-500' }
        ]}
      />

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest system activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New order received', time: '2 minutes ago', type: 'order' },
              { action: 'Product inventory updated', time: '15 minutes ago', type: 'product' },
              { action: 'Customer support ticket resolved', time: '1 hour ago', type: 'support' },
              { action: 'New user registration', time: '2 hours ago', type: 'user' },
              { action: 'Payment processed successfully', time: '3 hours ago', type: 'payment' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'order' ? 'bg-green-500' :
                  activity.type === 'product' ? 'bg-blue-500' :
                  activity.type === 'support' ? 'bg-yellow-500' :
                  activity.type === 'user' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products">
              <div className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                <Package className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Manage Products</h3>
                <p className="text-sm text-muted-foreground">Manage inventory</p>
              </div>
            </Link>
            <Link href="/admin/orders">
              <div className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Manage Orders</h3>
                <p className="text-sm text-muted-foreground">Order management</p>
              </div>
            </Link>
            <Link href="/admin/customers">
              <div className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                <Users className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Manage Customers</h3>
                <p className="text-sm text-muted-foreground">Customer management</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
