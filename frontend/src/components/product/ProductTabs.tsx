'use client';

import React, { useState } from 'react';
import { Product, Review } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Package, MessageSquare, Info } from 'lucide-react';

interface ProductTabsProps {
  product: Product;
  reviews: Review[];
  isLoadingReviews: boolean;
  onReviewSubmitted: (review: Review) => void;
}

type TabType = 'description' | 'specifications' | 'reviews';

const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  reviews,
  isLoadingReviews,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const tabs = [
    {
      id: 'description' as TabType,
      label: 'Description',
      icon: Info,
      count: null,
    },
    {
      id: 'specifications' as TabType,
      label: 'Specifications',
      icon: Package,
      count: null,
    },
    {
      id: 'reviews' as TabType,
      label: 'Reviews',
      icon: MessageSquare,
      count: reviews.length,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-medium mb-2">Key Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• High-quality materials</li>
                  <li>• Durable construction</li>
                  <li>• Easy to use</li>
                  <li>• Great value for money</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">What&apos;s Included</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 1x {product.title}</li>
                  <li>• User manual</li>
                  <li>• Warranty card</li>
                  <li>• Original packaging</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'specifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{product.weight}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Stock</span>
                  <span className="font-medium">{product.stock} units</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Product ID</span>
                  <span className="font-medium text-xs">{product._id}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">${product.price}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">
                    {product.averageRating ? `${product.averageRating.toFixed(1)}/5` : 'No ratings'}
                  </span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{formatDate(product.createdAt)}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-medium">{formatDate(product.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            {isLoadingReviews ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted text-sm flex items-center justify-center font-bold">
                        {review?.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">{review.fullName}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.length > 3 && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const el = document.getElementById('reviews-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      View All {reviews.length} Reviews
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <div className="border-b">
        <div className="flex flex-wrap sm:flex-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors w-full sm:w-auto ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <CardContent className="p-4 sm:p-6">{renderTabContent()}</CardContent>
    </Card>
  );
};

export default ProductTabs;
