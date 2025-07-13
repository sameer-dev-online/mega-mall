"use client";

import { CreditCard, Truck, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CartSummaryProps } from "@/types/api";
import { cartService } from "@/services/Api";

const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onProceedToCheckout,
  isUpdating
}) => {
  if (!cart) {
    return null;
  }

  // Calculate totals using cart service
  const subtotal = cartService.calculateCartTotal(cart);
  const tax = cartService.calculateTax(subtotal);
  const shipping = cartService.calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  const freeShippingThreshold = 50;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <div className="space-y-4">
      {/* Order Summary Card */}
      <Card className="lg:sticky lg:top-4">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CreditCard className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 p-4 sm:p-6">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Shipping</span>
            </div>
            <div className="text-right">
              {qualifiesForFreeShipping ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    FREE
                  </Badge>
                  <span className="line-through text-gray-400 text-sm">
                    $10.00
                  </span>
                </div>
              ) : (
                <span className="font-semibold">${shipping.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Free Shipping Progress */}
          {!qualifiesForFreeShipping && remainingForFreeShipping > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700 text-sm">
                <Truck className="w-4 h-4" />
                <span>
                  Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for FREE shipping!
                </span>
              </div>
              <div className="mt-2 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Tax */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tax (8%)</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>

          <hr className="border-gray-200" />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={onProceedToCheckout}
            disabled={isUpdating}
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
            size="lg"
          >
            {isUpdating ? (
              "Updating..."
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
            <Shield className="w-4 h-4" />
            <span>Secure checkout with SSL encryption</span>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-semibold text-gray-900">Why shop with us?</h4>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Free returns within 30 days</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>24/7 customer support</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Secure payment processing</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Fast shipping nationwide</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Accepted Payment Methods</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline" className="text-xs">Visa</Badge>
            <Badge variant="outline" className="text-xs">Mastercard</Badge>
            <Badge variant="outline" className="text-xs">PayPal</Badge>
            <Badge variant="outline" className="text-xs">COD</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartSummary;
