'use client';

import React, { useState, memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Product } from "@/types/api";
import { useCart } from "@/contexts/CartContext";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";

interface EnhancedProductCardProps {
  product: Product;
  badge?: "New Arrival" | "Sale" | "Best Seller";
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  badge,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart, isUpdating } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    const success = await addToCart(product._id, quantity);
    if (success) {
      setQuantity(1); // Reset quantity after successful add
    }
  };

  const handleQuickView = () => {
    setShowQuickView(true);
    // TODO: Implement quick view modal
    toast.info('Quick view feature coming soon!');
  };

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
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <motion.div
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="w-full h-full shadow-md hover:shadow-xl transition-all duration-300 border-0 bg-card overflow-hidden" >
        {/* Image Section */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.images && product.images.length > 0 && (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className={`object-cover transition-all duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${imageLoading ? 'blur-sm' : 'blur-0'}`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={false} // Lazy load by default
              quality={85} // Optimize image quality
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          )}
          
          {/* Loading overlay */}
          {imageLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {badge && (
              <Badge 
                className={`text-xs font-medium ${
                  badge === 'Sale' ? 'bg-red-500 hover:bg-red-600' :
                  badge === 'New Arrival' ? 'bg-green-500 hover:bg-green-600' :
                  'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {badge}
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Hover Actions */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md"
              onClick={handleQuickView}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Quick Add to Cart (appears on hover) */}
          <motion.div
            className="absolute bottom-3 left-3 right-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Button
              onClick={handleAddToCart}
              disabled={isUpdating || isOutOfStock}
              className="w-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isUpdating ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Quick Add'}
            </Button>
            <Button
              className="w-full bg-accent/90 hover:bg-accent text-accent-foreground shadow-lg"
              size="sm"
              onClick={() => router.push(`/product/${product._id}`)}
            >
              View Product
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4 space-y-3">
          {/* Category */}
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Rating */}
          {product.averageRating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(product.averageRating)}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.averageRating.toFixed(1)})
              </span>
              {product.reviews && (
                <span className="text-xs text-muted-foreground">
                  {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>
            
            {/* Stock indicator */}
            <div className="text-xs text-muted-foreground">
              {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
            </div>
          </div>

          {/* Description preview */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { EnhancedProductCard };
export default memo(EnhancedProductCard);
