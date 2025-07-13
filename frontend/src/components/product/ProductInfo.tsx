'use client';

import React, { useState } from 'react';
import { Product, Review } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Minus, 
  Plus,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { toast } from 'react-toastify';
import SocialShare from './SocialShare';

interface ProductInfoProps {
  product: Product;
  reviews: Review[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, reviews }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, isUpdating } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    const success = await addToCart(product._id, quantity);
    if (success) {
      setQuantity(1);
    } 
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add to wishlist');
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
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
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="w-5 h-5 text-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const averageRating = product.averageRating || 0;
  const reviewCount = reviews.length;

  return (
   // Inside the return statement of ProductInfo component
<div className="space-y-6">
  {/* Category */}
  <div>
    <Badge variant="secondary" className="text-xs sm:text-sm">
      {product.category}
    </Badge>
  </div>

  {/* Product Title */}
  <div>
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
      {product.title}
    </h1>
  </div>

  {/* Rating and Reviews */}
  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
    <div className="flex items-center gap-1">{renderStars(averageRating)}</div>
    <span className="text-sm text-muted-foreground">
      {averageRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
    </span>
  </div>

  {/* Price */}
  <div className="space-y-1">
    <div className="text-2xl sm:text-3xl font-bold text-primary">
      {formatPrice(product.price)}
    </div>
  </div>

  {/* Description */}
  <div className="prose prose-sm max-w-none">
    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
  </div>

  {/* Stock Status */}
  <div>
    {isOutOfStock ? (
      <Badge variant="destructive" className="text-xs sm:text-sm">
        Out of Stock
      </Badge>
    ) : isLowStock ? (
      <Badge className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm">
        Only {product.stock} left in stock
      </Badge>
    ) : (
      <Badge className="bg-green-500 hover:bg-green-600 text-xs sm:text-sm">
        In Stock ({product.stock} available)
      </Badge>
    )}
  </div>

  {/* Quantity Selector & Cart Actions */}
  <div className="space-y-4">
    {/* Quantity */}
    <div className="space-y-2 max-w-xs">
      <Label htmlFor="quantity" className="text-sm font-medium">
        Quantity
      </Label>
      <div className="flex items-center w-full border rounded-md overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Input
          id="quantity"
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
          className="h-10 w-20 text-center border-0 focus-visible:ring-0"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= product.stock}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Button
        onClick={handleAddToCart}
        disabled={isUpdating || isOutOfStock}
        className="w-full sm:flex-1 h-12 text-base"
        size="lg"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {isUpdating ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
      <Button
        variant="outline"
        onClick={handleWishlist}
        className="h-12 px-6 w-full sm:w-auto"
        size="lg"
      >
        <Heart
          className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
        />
      </Button>
    </div>
  </div>

  {/* Social Share */}
  <div className="space-y-3">
    <Label className="text-sm font-medium">Share this product</Label>
    <SocialShare
      product={product}
      url={`${window.location.origin}/product/${product._id}`}
    />
  </div>

  {/* Specifications Card */}
  <Card className="w-full">
    <CardContent className="p-4 sm:p-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-medium">{product.weight}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Category</span>
            <span className="font-medium">{product.category}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Stock</span>
            <span className="font-medium">{product.stock} units</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Product ID</span>
            <span className="font-medium text-xs">{product._id}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

  );
};

export default ProductInfo;
