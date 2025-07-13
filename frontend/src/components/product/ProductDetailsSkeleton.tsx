'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-muted rounded animate-pulse w-12" />
            <div className="h-4 bg-muted rounded animate-pulse w-1" />
            <div className="h-4 bg-muted rounded animate-pulse w-12" />
            <div className="h-4 bg-muted rounded animate-pulse w-1" />
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
            <div className="h-4 bg-muted rounded animate-pulse w-1" />
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
          </div>
        </div>

        {/* Main Product Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Images Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-muted rounded-lg animate-pulse" />
            
            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-20 h-20 bg-muted rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Product Information Skeleton */}
          <div className="space-y-6">
            {/* Category */}
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded animate-pulse w-full" />
              <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-muted rounded animate-pulse" />
                ))}
              </div>
              <div className="h-4 bg-muted rounded animate-pulse w-20" />
            </div>
            
            {/* Price */}
            <div className="h-10 bg-muted rounded animate-pulse w-32" />
            
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            </div>
            
            {/* Stock Status */}
            <div className="h-6 bg-muted rounded animate-pulse w-24" />
            
            {/* Quantity Selector and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="h-10 bg-muted rounded animate-pulse w-24" />
              <div className="h-10 bg-muted rounded animate-pulse w-40" />
            </div>
            
            {/* Social Share */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-10 h-10 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs Skeleton */}
        <div className="mb-16">
          <Card>
            <CardContent className="p-6">
              {/* Tab Headers */}
              <div className="flex gap-6 mb-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 bg-muted rounded animate-pulse w-20"
                  />
                ))}
              </div>
              
              {/* Tab Content */}
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-4 bg-muted rounded animate-pulse w-full"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="mb-16">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-6" />
          
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-32" />
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-muted rounded animate-pulse" />
                        ))}
                      </div>
                      <div className="space-y-1">
                        <div className="h-4 bg-muted rounded animate-pulse w-full" />
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div>
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-6" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-muted rounded animate-pulse w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
