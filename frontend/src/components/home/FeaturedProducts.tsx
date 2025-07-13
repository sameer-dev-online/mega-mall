'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Product } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedProductCard } from '@/components/shop/EnhancedProductCard';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  isLoading,
  error,
}) => {
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold">Unable to Load Products</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button asChild>
            <Link href="/shop">Browse All Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our handpicked selection of premium products, 
          chosen for their quality, popularity, and exceptional value.
        </p>
      </motion.div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="h-3 bg-muted rounded animate-pulse w-12" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-muted rounded animate-pulse w-16" />
                  <div className="h-3 bg-muted rounded animate-pulse w-12" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-muted rounded animate-pulse w-full" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No Featured Products</h3>
            <p className="text-muted-foreground">
              We&apos;re currently updating our featured products. Check back soon!
            </p>
            <Button asChild>
              <Link href="/shop">Browse All Products</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
            >
              <EnhancedProductCard 
                product={product} 
                badge={index < 3 ? "Best Seller" : undefined}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* View All Button */}
      {!isLoading && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
            <Link href="/shop" className="flex items-center gap-2">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          
          {products.length > 8 && (
            <p className="text-sm text-muted-foreground mt-4">
              Showing 8 of {products.length} featured products
            </p>
          )}
        </motion.div>
      )}

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-muted/50 rounded-2xl p-8 text-center"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl font-semibold">Why Choose Our Featured Products?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <p className="font-medium">Top Rated</p>
              <p className="text-muted-foreground">Highest customer satisfaction</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="font-medium">Best Selling</p>
              <p className="text-muted-foreground">Most popular among customers</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
              <p className="font-medium">Quality Assured</p>
              <p className="text-muted-foreground">Carefully selected for excellence</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(FeaturedProducts);
