'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Mail, Gift, Bell, Zap, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed to our newsletter!');
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: 'Exclusive Deals',
      description: 'Get access to subscriber-only discounts and special offers',
    },
    {
      icon: Bell,
      title: 'Early Access',
      description: 'Be the first to know about new products and sales',
    },
    {
      icon: Zap,
      title: 'Flash Sales',
      description: 'Receive instant notifications about limited-time offers',
    },
  ];

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">Welcome to the Family!</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Thank you for subscribing! You&apos;ll receive your first exclusive offer within 24 hours.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/70">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            10% off your next order
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Weekly deals & updates
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Flash sale alerts
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Main Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-8"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-8 h-8 text-primary-foreground" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Stay in the Loop
            </h2>
          </div>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive deals, 
            new arrivals, and special promotions. Plus, get 10% off your first order!
          </p>
        </div>

        {/* Signup Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-white/20"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !email}
              className="bg-white text-primary hover:bg-white/90 px-8"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          <p className="text-xs text-primary-foreground/60 mt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.form>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center space-y-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/70">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Additional Incentives */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm"
      >
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-primary-foreground">
            Join 50,000+ Happy Subscribers
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              Weekly exclusive deals
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              New product alerts
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              Style tips & trends
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full" />
              Flash sale notifications
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsletterSection;
