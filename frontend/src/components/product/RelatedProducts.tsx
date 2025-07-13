'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  products: Product[];
  isLoading: boolean;
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded animate-pulse w-48" />
          <div className="h-10 bg-muted rounded animate-pulse w-32" />
        </div>
        
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
    );
  }

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 mb-4 text-muted-foreground">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1m16 0H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No related products found
            </h3>
            <p className="text-muted-foreground max-w-md mb-4">
              We couldn&apos;t find any related products at the moment. Check out our full catalog instead.
            </p>
            <Button asChild>
              <Link href="/shop">
                Browse All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <Button variant="outline" asChild>
          <Link href="/shop" className="flex items-center gap-2">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
            }}
          >
            <RelatedProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center pt-8">
        <p className="text-muted-foreground mb-4">
          Looking for something else?
        </p>
        <Button asChild size="lg">
          <Link href="/shop">
            Explore All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Simplified product card for related products
const RelatedProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-3 h-3">
            <Star className="w-3 h-3 text-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-3 h-3 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/product/${product._id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
        {/* Product Image */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 text-muted-foreground opacity-50">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
            </div>
          )}
          
          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="p-4 space-y-2">
          {/* Category */}
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category}
          </div>

          {/* Title */}
          <h3 className="font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          {product.averageRating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {renderStars(product.averageRating)}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.averageRating.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 && product.stock <= 5 && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">
                Low Stock
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RelatedProducts;
