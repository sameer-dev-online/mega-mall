"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {  CartItem, ApiResponse } from '@/types/api';
import { cartService } from '@/services/Api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface CartContextType {
  cart: CartItem[] | null;
  isLoading: boolean;
  isUpdating: boolean;
  itemCount: number;
  addToCart: (productId: string, quantity: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  getCartCalculations: () => {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem [] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Calculate item count
  const itemCount = cart?.length || 0;

  // Fetch cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await cartService.getCartItems();
      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (error) {
      // const axiosError = error as AxiosError<ApiResponse>;
      // console.error('Error fetching cart:', axiosError);
      // Don't show toast for initial cart fetch failures
      // Set empty cart on error to prevent undefined issues
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return false;
    }

    try {
      setIsUpdating(true);
      const response: ApiResponse<CartItem[]> = await cartService.addToCart({ productId, quantity });
      
      if (response.success && response.data) {
        setCart(response.data);
        toast.success('Item added to cart successfully');
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to add item to cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<boolean> => {
    if (!isAuthenticated || quantity < 1) return false;

    try {
      setIsUpdating(true);
      const response = await cartService.updateQuantity({ productId, quantity });
      
      if (response.success && response.data) {
        toast.success('Quantity updated successfully');
        setCart(response.data);
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to update quantity');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      setIsUpdating(true);
      const response = await cartService.removeProduct(productId);
      
      if (response.success && response.data) {
        setCart(response.data);
        toast.success('Item removed from cart');
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to remove item');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const getCartCalculations = () => {
    if (!cart) {
      return { subtotal: 0, tax: 0, shipping: 0, total: 0 };
    }

    const subtotal = cartService.calculateCartTotal(cart);
    const tax = cartService.calculateTax(subtotal);
    const shipping = cartService.calculateShipping(subtotal);
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
  };

  const value: CartContextType = {
    cart: cart as CartItem[] | null,
    isLoading,
    isUpdating,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getCartCalculations,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
