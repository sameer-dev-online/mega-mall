"use client";

import React from 'react';
import { useAdminAuth } from '@/contexts/admin/AuthContext';
import { Admin } from '@/types/api';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, Shield } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'superAdmin';
  fallback?: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback
}) => {
  const { admin, isAuthenticated, isLoading } = useAdminAuth();

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !admin) {
    return fallback || (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <div>
          <h4>Access Denied</h4>
          <p>You must be logged in as an admin to access this page.</p>
        </div>
      </Alert>
    );
  }

  // Check role-based access
  if (requiredRole && !hasRequiredRole(admin, requiredRole)) {
    return fallback || (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <div>
          <h4>Insufficient Permissions</h4>
          <p>
            You need {requiredRole} privileges to access this page. 
            Your current role is: {admin.role}
          </p>
        </div>
      </Alert>
    );
  }

  return <>{children}</>;
};

/**
 * Check if admin has the required role
 */
const hasRequiredRole = (admin: Admin, requiredRole: 'admin' | 'superAdmin'): boolean => {
  if (requiredRole === 'admin') {
    return admin.role === 'admin' || admin.role === 'superAdmin';
  }
  
  if (requiredRole === 'superAdmin') {
    return admin.role === 'superAdmin';
  }
  
  return false;
};

export default AdminProtectedRoute;
