'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { COD_FEE } from '@/types/order';
import { ShoppingBag, Package, CreditCard } from 'lucide-react';

interface OrderSummaryProps {
  showTitle?: boolean;
  compact?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  showTitle = true, 
  compact = false 
}) => {
  const { cart, getCartCalculations } = useCart();
  const calculations = getCartCalculations();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (!cart || cart.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground">Add some items to proceed with checkout</p>
        </CardContent>
      </Card>
    );
  }

  const totalWithCOD = calculations.total + COD_FEE ;

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="flex gap-4">
              {/* Product Image */}
              <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={item.images[0].url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                {/* Quantity Badge */}
                <Badge
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {item.quantity}
                </Badge>
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.category}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">
                    { formatPrice(item.price)} × {item.quantity}
                  </span>
                  <span className="font-semibold text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </span>
            <span>{formatPrice(calculations.subtotal)}</span>
          </div>

          {/* COD Fee */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Cash on Delivery Fee</span>
            </div>
            <span>{formatPrice(COD_FEE)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>

          <Separator />

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (8%)</span>
            <span>{formatPrice(calculations.tax)}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(totalWithCOD)}</span>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Payment Method</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Cash on Delivery - Pay when your order arrives at your doorstep
          </p>
        </div>

        {/* Delivery Info */}
        {!compact && (
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm text-blue-900 dark:text-blue-100">
                Estimated Delivery
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              3-5 business days from order confirmation
            </p>
          </div>
        )}

        {/* Order Notes */}
        {!compact && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Free shipping on all orders</p>
            <p>• 30-day easy returns</p>
            <p>• Secure packaging guaranteed</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
