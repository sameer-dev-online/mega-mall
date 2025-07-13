'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShippingAddress, FormErrors } from '@/types/order';
import { User, AlertCircle } from 'lucide-react';

interface CustomerInfoFormProps {
  onSubmit: (data: ShippingAddress) => void;
  onValidationChange: (isValid: boolean) => void;
  isSubmitting?: boolean;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  onSubmit,
  onValidationChange,
  isSubmitting = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Validation function
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^03\d{9}$/;

        if (!phoneRegex.test(value)) {
          return 'Please enter a valid phone number';
        }
        return '';
      
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 5) return 'Please enter a complete address';
        return '';
      
      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'Please enter a valid city name';
        return '';
      
      case 'state':
        if (!value.trim()) return 'State is required';
        return '';
      
      case 'zipCode':
        if (!value.trim()) return 'ZIP code is required';
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
        return '';
      
      case 'country':
        if (!value.trim()) return 'Country is required';
        return '';
      
      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof ShippingAddress]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle input change
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle input blur
  const handleInputBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof ShippingAddress]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Check if form is valid and notify parent
  useEffect(() => {
    const isValid = validateForm();
    onValidationChange(isValid);
  }, [formData, onValidationChange]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'Other',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleInputBlur('fullName')}
                  placeholder="Enter your full name"
                  className={errors.fullName && touched.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && touched.fullName && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleInputBlur('email')}
                  placeholder="Enter your email"
                  className={errors.email && touched.email ? 'border-destructive' : ''}
                />
                {errors.email && touched.email && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleInputBlur('phone')}
                placeholder="Enter your phone number"
                className={errors.phone && touched.phone ? 'border-destructive' : ''}
              />
              {errors.phone && touched.phone && (
                <div className="flex items-center gap-1 text-destructive text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Shipping Address
            </h3>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onBlur={() => handleInputBlur('address')}
                placeholder="Enter your street address"
                className={errors.address && touched.address ? 'border-destructive' : ''}
              />
              {errors.address && touched.address && (
                <div className="flex items-center gap-1 text-destructive text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {errors.address}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  onBlur={() => handleInputBlur('city')}
                  placeholder="City"
                  className={errors.city && touched.city ? 'border-destructive' : ''}
                />
                {errors.city && touched.city && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.city}
                  </div>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  onBlur={() => handleInputBlur('state')}
                  placeholder="State"
                  className={errors.state && touched.state ? 'border-destructive' : ''}
                />
                {errors.state && touched.state && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.state}
                  </div>
                )}
              </div>

              {/* ZIP Code */}
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  onBlur={() => handleInputBlur('zipCode')}
                  placeholder="12345"
                  className={errors.zipCode && touched.zipCode ? 'border-destructive' : ''}
                />
                {errors.zipCode && touched.zipCode && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.zipCode}
                  </div>
                )}
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                onBlur={() => handleInputBlur('country')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).some(key => errors[key as keyof FormErrors])}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoForm;
