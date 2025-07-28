"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin, ApiResponse } from '@/types/api';
import { adminService } from '@/services/Api';
import { AxiosError } from 'axios';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (admin: Admin, accessToken: string) => void;
  logout: () => void;
  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!admin;

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          const response = await adminService.getAdmin();
          if (response.success && response.data) {
            setAdmin((response.data as Admin));
          } 
        } catch (error: unknown ) {
          const axiousError = error as AxiosError<ApiResponse>;
          if(axiousError.response) {
            console.error('Error checking auth status:', axiousError.response.data.message);
            localStorage.removeItem('accessToken');

          }
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (admin: Admin, accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setAdmin(admin);
  };

  const logout = async () => {
    try {
      await adminService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setAdmin(null);
    }
  };

  
  const value: AuthContextType = {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
