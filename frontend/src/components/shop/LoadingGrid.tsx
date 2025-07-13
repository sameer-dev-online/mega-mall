'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const LoadingGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="w-full h-full shadow-md border-0 bg-card overflow-hidden">
          {/* Image Skeleton */}
          <div className="relative aspect-square bg-muted animate-pulse" />
          
          {/* Content Skeleton */}
          <CardContent className="p-4 space-y-3">
            {/* Category */}
            <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-muted rounded animate-pulse" />
                ))}
              </div>
              <div className="h-3 bg-muted rounded animate-pulse w-12" />
            </div>
            
            {/* Price and Stock */}
            <div className="flex items-center justify-between">
              <div className="h-5 bg-muted rounded animate-pulse w-16" />
              <div className="h-3 bg-muted rounded animate-pulse w-12" />
            </div>
            
            {/* Description */}
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded animate-pulse w-full" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LoadingGrid;
