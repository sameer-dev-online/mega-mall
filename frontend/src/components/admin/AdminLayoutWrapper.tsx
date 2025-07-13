"use client";

import React from 'react';
import { useAdminAuth } from '@/contexts/admin/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminLoginPage from './AdminLoginPage';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

const AdminLayoutWrapper: React.FC<AdminLayoutWrapperProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar skeleton */}
          <div className="w-64 bg-card border-r border-border p-4">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          
          {/* Main content skeleton */}
          <div className="flex-1">
            <div className="h-16 bg-card border-b border-border p-4">
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="p-6">
              <Skeleton className="h-8 w-64 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutWrapper;
