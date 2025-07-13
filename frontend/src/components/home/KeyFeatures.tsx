'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Shield, 
  RotateCcw, 
  Headphones, 
  CreditCard, 
  Award,
  Clock,
  Globe
} from 'lucide-react';

const KeyFeatures: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery on orders over $50. Fast and reliable shipping worldwide.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions with SSL encryption and fraud protection.',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day hassle-free returns. No questions asked return policy.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support via chat, email, and phone.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Pay with credit cards, PayPal, Apple Pay, Google Pay, and more.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'Premium quality products with manufacturer warranty included.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Orders processed within 24 hours. Quick dispatch and delivery.',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      icon: Globe,
      title: 'Worldwide Delivery',
      description: 'We ship to over 100 countries. Global reach, local service.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100 dark:bg-teal-900/20',
    },
  ];

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
        <h2 className="text-3xl md:text-4xl font-bold">Why Choose Mega Mall?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We&apos;re committed to providing you with the best shopping experience possible.
          Here&apos;s what makes us different from the rest.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              className="group text-center space-y-4 p-6 rounded-2xl hover:bg-muted/50 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-8 h-8 ${feature.color}`} />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8"
      >
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold">Trusted by Thousands</h3>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Products Sold</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">4.9</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              SSL Secured
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              Quality Certified
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              Worldwide Shipping
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Headphones className="w-4 h-4" />
              24/7 Support
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center space-y-4"
      >
        <h3 className="text-xl font-semibold">Ready to Experience the Difference?</h3>
        <p className="text-muted-foreground">
          Join thousands of satisfied customers who trust Mega Mall for their shopping needs.
        </p>
      </motion.div>
    </div>
  );
};

export default React.memo(KeyFeatures);
