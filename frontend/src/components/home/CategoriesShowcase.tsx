'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Smartphone, 
  Shirt, 
  Home, 
  Gamepad2, 
  Book, 
  Dumbbell,
  Car,
  Baby,
  Palette,
  Grid3X3
} from 'lucide-react';

interface CategoriesShowcaseProps {
  categories: string[];
  isLoading: boolean;
}

// Category icons mapping
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'electronics': Smartphone,
  'fashion': Shirt,
  'home': Home,
  'gaming': Gamepad2,
  'books': Book,
  'sports': Dumbbell,
  'automotive': Car,
  'baby': Baby,
  'art': Palette,
  'default': Grid3X3,
};

// Category colors for visual variety
const categoryColors = [
  'from-blue-500/20 to-blue-600/20',
  'from-purple-500/20 to-purple-600/20',
  'from-green-500/20 to-green-600/20',
  'from-orange-500/20 to-orange-600/20',
  'from-pink-500/20 to-pink-600/20',
  'from-indigo-500/20 to-indigo-600/20',
  'from-red-500/20 to-red-600/20',
  'from-teal-500/20 to-teal-600/20',
];

const CategoriesShowcase: React.FC<CategoriesShowcaseProps> = ({
  categories,
  isLoading,
}) => {
  // Mock product counts for categories (in a real app, this would come from the API)
  const getCategoryCount = (category: string) => {
    const counts: Record<string, number> = {
      'electronics': 1250,
      'fashion': 890,
      'home': 650,
      'gaming': 420,
      'books': 780,
      'sports': 340,
      'automotive': 290,
      'baby': 180,
    };
    return counts[category.toLowerCase()] || Math.floor(Math.random() * 500) + 100;
  };

  const getCategoryIcon = (category: string) => {
    const key = category.toLowerCase();
    return categoryIcons[key] || categoryIcons.default;
  };

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <div className="h-10 bg-muted rounded animate-pulse w-64 mx-auto" />
          <div className="h-6 bg-muted rounded animate-pulse w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-2">
                <div className="h-6 bg-muted rounded animate-pulse w-full" />
                <div className="h-4 bg-muted rounded animate-pulse w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Grid3X3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No Categories Available</h3>
          <p className="text-muted-foreground">
            We&apos;re currently updating our categories. Check back soon!
          </p>
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
        <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our diverse range of product categories, 
          each carefully curated to meet your specific needs and preferences.
        </p>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.slice(0, 8).map((category, index) => {
          const Icon = getCategoryIcon(category);
          const colorClass = categoryColors[index % categoryColors.length];
          const productCount = getCategoryCount(category);

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
            >
              <Link href={`/shop?category=${encodeURIComponent(category)}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                  {/* Category Image/Icon Area */}
                  <div className={`aspect-[4/3] bg-gradient-to-br ${colorClass} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-8 h-8 text-foreground" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-white/90 text-foreground hover:bg-white"
                        >
                          {productCount}+ Products
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    
                    {/* Arrow Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Category Info */}
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg capitalize group-hover:text-primary transition-colors">
                        {category}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Discover amazing {category.toLowerCase()} products
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View All Categories Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
          <Link href="/shop" className="flex items-center gap-2">
            View All Categories
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
        
        {categories.length > 8 && (
          <p className="text-sm text-muted-foreground mt-4">
            Showing 8 of {categories.length} categories
          </p>
        )}
      </motion.div>

      {/* Category Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-muted/50 rounded-2xl p-8"
      >
        <div className="text-center space-y-6">
          <h3 className="text-xl font-semibold">Why Shop by Category?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Grid3X3 className="w-4 h-4 text-primary" />
              </div>
              <p className="font-medium">Organized Shopping</p>
              <p className="text-muted-foreground">Find exactly what you need quickly</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
              <p className="font-medium">Easy Navigation</p>
              <p className="text-muted-foreground">Browse products by your interests</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-4 h-4 text-primary" />
              </div>
              <p className="font-medium">Curated Selection</p>
              <p className="text-muted-foreground">Quality products in every category</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(CategoriesShowcase);
