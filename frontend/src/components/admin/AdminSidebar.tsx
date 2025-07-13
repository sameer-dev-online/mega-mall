"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/admin/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserPlus,
  Settings,
  BarChart3,
  MessageSquare,
  LogOut,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    description: 'Manage inventory'
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Order management'
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'Customer management'
  },
  {
    title: 'Admin Users',
    href: '/admin/admin-users',
    icon: UserPlus,
    description: 'Manage admin accounts',
    superAdminOnly: true
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Sales and performance'
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
    description: 'Customer support'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  }
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.superAdminOnly && admin?.role !== 'superAdmin') {
      return false;
    }
    return true;
  });

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center space-x-2">
          <Store className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Mega Mall</h1>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <div className="flex-1">
                <div>{item.title}</div>
                {item.description && (
                  <div className="text-xs opacity-70">{item.description}</div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Admin Info and Logout */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <p className="text-sm font-medium text-foreground">{admin?.fullName}</p>
          <p className="text-xs text-muted-foreground">{admin?.email}</p>
          <p className="text-xs text-primary capitalize">{admin?.role}</p>
        </div>
        
        <Separator className="mb-3" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
