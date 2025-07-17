'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star, Users, Shield } from 'lucide-react';

const HeroSection: React.FC = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: ShoppingBag, value: '10K+', label: 'Products' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
    { icon: Shield, value: '100%', label: 'Secure Shopping' },
  ];

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] pt-[20px] bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Background Shapes */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px] lg:min-h-[700px]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-sm px-4 py-2">
                🎉 New Collection Available
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Ultimate
                <span className="text-primary block">Shopping</span>
                Destination
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Discover thousands of premium products at unbeatable prices.
                Shop with confidence with our secure payment, free shipping, and easy returns.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Free Shipping Over $50
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                30-Day Easy Returns
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                24/7 Customer Support
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="text-lg px-8 py-6 h-[20px]">
                <Link href="/shop" className="flex items-center gap-2">
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center space-y-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="font-bold text-xl">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Content - Testimonials & Trust */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Testimonial Card */}
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center text-xl font-bold text-primary">
                  A
                </div>
                <div>
                  <h4 className="text-base font-semibold">Ayesha M.</h4>
                  <p className="text-sm text-muted-foreground">Karachi, Pakistan</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm italic">
                “I’ve been shopping here for months and every order has been smooth and satisfying. The products are top-notch and delivery is always on time!”
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Genuine Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-muted-foreground">Trusted by 50K+</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-muted-foreground">Top Rated Store</span>
              </div>
            </div>

            {/* Featured Brands */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Featured Brands</h4>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary">Nike</span>
                <span className="text-lg font-bold text-primary">Apple</span>
                <span className="text-lg font-bold text-primary">Adidas</span>
                <span className="text-lg font-bold text-primary">Samsung</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 fill-background"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28..." opacity=".25" />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05..." opacity=".5" />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57..." />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
