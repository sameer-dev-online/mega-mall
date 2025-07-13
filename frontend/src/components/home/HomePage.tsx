'use client';

import React, { useState, useEffect, memo } from 'react';
import { Product } from '@/types/api';
import { productService } from '@/services/Api/productService';
import { toast } from 'react-toastify';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import { lazy, Suspense } from 'react';

// Lazy load below-the-fold components
const CategoriesShowcase = lazy(() => import('./CategoriesShowcase'));
const KeyFeatures = lazy(() => import('./KeyFeatures'));
const TestimonialsSection = lazy(() => import('./TestimonialsSection'));
const NewsletterSection = lazy(() => import('./NewsletterSection'));

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setError(null);
        
        const response = await productService.getAllProducts();
        
        if (response.success && response.data) {
          // Get first 12 products as featured (you can modify this logic)
          const featured = response.data.products
            .sort((a, b) => {
              // Sort by rating first, then by creation date
              if (a.averageRating && b.averageRating) {
                return b.averageRating - a.averageRating;
              }
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .slice(0, 12);
          
          setFeaturedProducts(featured);
          
          // Extract unique categories
          const uniqueCategories = productService.getCategories(response.data.products);
          setCategories(uniqueCategories);
          setIsLoadingCategories(false);
        } else {
          setError('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Failed to load products. Please try again.');
        toast.error('Failed to load featured products');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <FeaturedProducts
            products={featuredProducts}
            isLoading={isLoadingProducts}
            error={error}
          />
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-96 bg-muted/50 rounded-xl animate-pulse" />}>
            <CategoriesShowcase
              categories={categories}
              isLoading={isLoadingCategories}
            />
          </Suspense>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-96 bg-muted/50 rounded-xl animate-pulse" />}>
            <KeyFeatures />
          </Suspense>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-96 bg-muted/50 rounded-xl animate-pulse" />}>
            <TestimonialsSection />
          </Suspense>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-64 bg-primary-foreground/10 rounded-xl animate-pulse" />}>
            <NewsletterSection />
          </Suspense>
        </div>
      </section>
    </div>
  );
};

export default memo(HomePage);
