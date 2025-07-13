'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  product?: string;
  avatar?: string;
}

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      comment: 'Amazing shopping experience! The products arrived quickly and exactly as described. The customer service team was incredibly helpful when I had questions about my order.',
      product: 'Wireless Headphones',
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Toronto, Canada',
      rating: 5,
      comment: 'I\'ve been shopping here for over a year now, and I\'m consistently impressed with the quality and variety. The free shipping and easy returns make it my go-to store.',
      product: 'Gaming Laptop',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      location: 'London, UK',
      rating: 5,
      comment: 'The best online shopping experience I\'ve ever had. Fast delivery, excellent packaging, and the product quality exceeded my expectations. Highly recommended!',
      product: 'Designer Handbag',
    },
    {
      id: 4,
      name: 'David Kim',
      location: 'Sydney, Australia',
      rating: 5,
      comment: 'Outstanding customer service and product quality. When I had an issue with my order, they resolved it immediately. This is how e-commerce should be done!',
      product: 'Smart Watch',
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      location: 'Berlin, Germany',
      rating: 5,
      comment: 'I love the variety of products and competitive prices. The website is easy to navigate, and the checkout process is smooth. Will definitely shop here again!',
      product: 'Home Decor Set',
    },
    {
      id: 6,
      name: 'James Wilson',
      location: 'Tokyo, Japan',
      rating: 5,
      comment: 'Mega Mall has become my favorite online store. The quality is consistent, shipping is fast, and their return policy gives me confidence in every purchase.',
      product: 'Fitness Equipment',
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

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
          <Quote className="w-6 h-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
          <Quote className="w-6 h-6 text-primary scale-x-[-1]" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our satisfied customers 
          have to say about their shopping experience with us.
        </p>
      </motion.div>

      {/* Testimonials Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
          <AnimatePresence mode="wait">
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${currentIndex}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 space-y-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Comment */}
                    <blockquote className="text-muted-foreground leading-relaxed">
                      "{testimonial.comment}"
                    </blockquote>

                    {/* Product */}
                    {testimonial.product && (
                      <div className="text-sm text-primary font-medium">
                        Purchased: {testimonial.product}
                      </div>
                    )}

                    {/* Customer Info */}
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="bg-muted/50 rounded-2xl p-8 text-center"
      >
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Join Our Happy Customers</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">4.9/5</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">98%</div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <p className="text-muted-foreground">Customer Support</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestimonialsSection;
