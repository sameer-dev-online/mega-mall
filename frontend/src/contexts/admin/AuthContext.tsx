"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin, ApiResponse } from '@/types/api';
import { adminService } from '@/services/Api';
import { AxiosError } from 'axios';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (admin: Admin, token: string) => void;
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
      const token = localStorage.getItem('access_token');
      
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
            localStorage.removeItem('access_token');

          }
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (admin: Admin, access_token: string) => {
    localStorage.setItem('access_token', access_token);
    setAdmin(admin);
  };

  const logout = async () => {
    try {
      await adminService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('access_token');
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
