'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const HomePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="relative h-[600px] bg-muted animate-pulse">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <div className="h-16 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-6 bg-muted-foreground/20 rounded animate-pulse w-3/4" />
            <div className="h-12 bg-muted-foreground/20 rounded animate-pulse w-48" />
          </div>
        </div>
      </section>

      {/* Featured Products Skeleton */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted rounded animate-pulse w-64 mx-auto mb-4" />
            <div className="h-6 bg-muted rounded animate-pulse w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
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
      </section>

      {/* Categories Skeleton */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted rounded animate-pulse w-64 mx-auto mb-4" />
            <div className="h-6 bg-muted rounded animate-pulse w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-6 bg-muted rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Skeleton */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted rounded animate-pulse w-64 mx-auto mb-4" />
            <div className="h-6 bg-muted rounded animate-pulse w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full animate-pulse mx-auto" />
                <div className="h-6 bg-muted rounded animate-pulse w-32 mx-auto" />
                <div className="h-4 bg-muted rounded animate-pulse w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted rounded animate-pulse w-64 mx-auto mb-4" />
            <div className="h-6 bg-muted rounded animate-pulse w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded animate-pulse w-24" />
                      <div className="h-3 bg-muted rounded animate-pulse w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Skeleton */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="h-10 bg-primary-foreground/20 rounded animate-pulse w-64 mx-auto" />
            <div className="h-6 bg-primary-foreground/20 rounded animate-pulse w-96 mx-auto" />
            <div className="flex justify-center">
              <div className="h-12 bg-primary-foreground/20 rounded animate-pulse w-80" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageSkeleton;
