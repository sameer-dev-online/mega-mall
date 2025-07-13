"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { useCart } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import { CartItem, CartSummary, EmptyCart } from "@/components/cart";
import CartErrorBoundary from "@/components/cart/CartErrorBoundary";

export default function CartPage() {
  const { cart, isLoading, isUpdating, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    await updateQuantity(productId, newQuantity);
    return true;
  };

  const handleRemoveItem = async (productId: string) => {
    const success = await removeFromCart(productId);
    if(success) {
      return true;
    }
    return false;
  };  

  const handleContinueShopping = () => {
    router.push("/shop");
  };

  const handleProceedToCheckout = () => {
    // TODO: Implement checkout page navigation
    router.push("/checkout");
  };

  if (isLoading) {
    return <LoadingPage message="Loading your cart..." />;
  }

  return (
    <ProtectedRoute>
      <CartErrorBoundary>
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={handleContinueShopping}
              className="mb-4 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
              </div>
              {cart && cart.map((item) => (
                <span key={item.productId} className="text-sm sm:text-lg text-gray-600">
                  ({item.quantity} {item.quantity === 1 ? 'item' : 'items'})
                </span>
              ))}
            </div>
          </div>

          {/* Cart Content */}
          {!cart || cart.length === 0 ? (
            <EmptyCart onContinueShopping={handleContinueShopping} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Cart Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    {cart &&  cart.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        onQuantityUpdate={handleQuantityUpdate}
                        onRemove={handleRemoveItem}
                        isUpdating={isUpdating}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <CartSummary
                  cart={cart && cart }
                  onProceedToCheckout={handleProceedToCheckout}
                  isUpdating={isUpdating}
                />
              </div>
            </div>
          )}
        </div>
        </div>
      </CartErrorBoundary>
    </ProtectedRoute>
  );
}
