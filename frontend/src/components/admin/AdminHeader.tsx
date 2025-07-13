"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/products': 'Product Management',
    '/admin/orders': 'Order Management',
    '/admin/customers': 'Customer Management',
    '/admin/admin-users': 'Admin User Management',
    '/admin/analytics': 'Analytics & Reports',
    '/admin/messages': 'Customer Messages',
    '/admin/settings': 'Settings'
  };

  // Check for exact match first
  if (routes[pathname]) {
    return routes[pathname];
  }

  // Check for partial matches (for dynamic routes)
  for (const [route, title] of Object.entries(routes)) {
    if (pathname.startsWith(route) && route !== '/admin') {
      return title;
    }
  }

  return 'Admin Panel';
};

const AdminHeader: React.FC = () => {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Left side - Page title and breadcrumb */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div>
          <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Right side - Search and notifications */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 w-64"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            3
          </Badge>
        </Button>

        {/* Mobile search button */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
