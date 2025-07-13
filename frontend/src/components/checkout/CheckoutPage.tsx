'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CustomerInfoForm from './CustomerInfoForm';
import OrderSummary from './OrderSummary';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/services/Api';
import { ShippingAddress, PaymentMethod, PAYMENT_METHODS, CreateOrderRequest } from '@/types/order';
import { PlaceOrderData } from '@/types/api';
import { toast } from 'react-toastify';
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { cartService } from '@/services/Api/cartService';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, getCartCalculations, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState<ShippingAddress | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const calculations = getCartCalculations();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to proceed with checkout');
      router.push('/signin');
      return;
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isAuthenticated && (!cart || cart.length === 0)) {
      router.push('/cart');
      return;
    }
  }, [cart, isAuthenticated, router]);

  const handleCustomerInfoSubmit = (data: ShippingAddress) => {
    setCustomerInfo(data);
    setOrderError(null);
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  const handlePaymentMethodChange = (methodType: string) => {
    const method = PAYMENT_METHODS.find(m => m.type === methodType);
    if (method && method.available) {
      setSelectedPaymentMethod(method);
      setOrderError(null);
    }
  };

  const calculateOrderTotal = () => {
    const subtotal = calculations.subtotal;
    const tax = calculations.tax;
    const codFee = selectedPaymentMethod.type === 'cod' ? selectedPaymentMethod.fee : 0;
    return subtotal + codFee + tax;
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo || !isFormValid || !cart?.length) {
      setOrderError('Please complete all required fields');
      return;
    }

    if (!selectedPaymentMethod.available) {
      setOrderError('Selected payment method is not available');
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      // Prepare order data for the API
      const orderData: PlaceOrderData = {
        fullName: customerInfo.fullName,
        address: customerInfo.address,
        phone: customerInfo.phone,
        city: customerInfo.city,
        state: customerInfo.state,
        postalCode: customerInfo.zipCode,
        country: customerInfo.country,
        paymentMethod: selectedPaymentMethod.type,
      };

      const response = await orderService.placeOrder(orderData);

      if (response.success && response.data) {
        // Clear cart after successful order
        clearCart();
        
        // Show success message
        toast.success('Order placed successfully!');
        
        // Redirect to order confirmation page
        router.push(`/order-confirmation/${response.data._id}`);
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Order placement error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
      setOrderError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Show loading or redirect if not ready
  if (!isAuthenticated || !cart?.length) {
    return null;
  }

  const orderTotal = calculateOrderTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order with secure checkout</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-green-700">Cart Review</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-700">Checkout</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <CustomerInfoForm
              onSubmit={handleCustomerInfoSubmit}
              onValidationChange={handleValidationChange}
              isSubmitting={isPlacingOrder}
            />

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPaymentMethod.type}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-3"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.type}
                      className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                        method.available
                          ? 'hover:bg-gray-50 cursor-pointer'
                          : 'bg-gray-50 cursor-not-allowed opacity-60'
                      } ${
                        selectedPaymentMethod.type === method.type && method.available
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <RadioGroupItem
                        value={method.type}
                        id={method.type}
                        disabled={!method.available}
                      />
                      <Label
                        htmlFor={method.type}
                        className={`flex-1 cursor-pointer ${!method.available ? 'cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.fee > 0 && (
                              <Badge variant="secondary">+${method.fee}</Badge>
                            )}
                            {!method.available && (
                              <Badge variant="outline">Coming Soon</Badge>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Error */}
            {orderError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{orderError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary showTitle={true} compact={false} />
              
              {/* Order Total with COD Fee */}
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${calculations.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedPaymentMethod.fee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>COD Fee</span>
                        <span>${selectedPaymentMethod.fee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%)</span>
                      <span>${calculations.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!isFormValid || isPlacingOrder || !selectedPaymentMethod.available}
                    className="w-full mt-6"
                    size="lg"
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Place Order (${orderTotal.toFixed(2)})
                      </>
                    )}
                  </Button>

                  <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                    <Truck className="w-3 h-3 mr-1" />
                    Free delivery on orders over $50
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
