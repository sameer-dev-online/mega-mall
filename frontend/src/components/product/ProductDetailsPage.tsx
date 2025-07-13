'use client';

import React, { useState, useEffect, memo, useCallback } from 'react';
import { Product, Review } from '@/types/api';
import { productService } from '@/services/Api/productService';
import { toast } from 'react-toastify';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import ReviewsSection from './ReviewsSection';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface ProductDetailsPageProps {
  product: Product;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);

  // Fetch reviews
  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const response = await productService.getReviews(product._id);
        if (response.success && response.data) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;
    const fetchRelatedProducts = async () => {
      try {
        setIsLoadingRelated(true);
        const response = await productService.getProductsByCategory({
          category: product.category,
          limit: 8,
        });
        if (response.success && response.data) {
          const filtered = response.data.products
            .filter((p) => p._id !== product._id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setIsLoadingRelated(false);
      }
    };
    fetchRelatedProducts();
  }, [product]);

  const handleReviewSubmitted = useCallback((newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    toast.success('Review submitted successfully!');
  }, []);

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6 sm:mb-8">
          <BreadcrumbList className="flex flex-wrap gap-2 text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/shop?category=${encodeURIComponent(product.category)}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mb-12 md:mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <ProductImageGallery images={product.images} productTitle={product.title} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <ProductInfo product={product} reviews={reviews} />
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-12 md:mb-16">
          <ProductTabs
            product={product}
            reviews={reviews}
            isLoadingReviews={isLoadingReviews}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>

        {/* Reviews Section */}
        <div id="reviews-section" className="mb-12 md:mb-16">
          <ReviewsSection
            productId={product._id}
            reviews={reviews}
            isLoading={isLoadingReviews}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>

        {/* Related Products */}
        <div className="mb-8 md:mb-16">
          <RelatedProducts
            products={relatedProducts}
            isLoading={isLoadingRelated}
            currentProductId={product._id}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetailsPage);
