'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Package,
    title: 'Premium Products',
    description: 'We offer a wide range of high-quality and trendy items from top brands.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Enjoy nationwide delivery with tracking and flexible return options.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Shopping',
    description: 'Shop confidently with secure payments and buyer protection.',
  },
];

const AboutPage = () => {
  return (
    <section className="min-h-screen bg-background text-foreground py-16 px-4 lg:px-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Mega Mall</h1>
        <p className="text-muted-foreground text-lg">
          Mega Mall is your one-stop destination for everything fashion, tech, lifestyle & more.
          We&apos;re committed to providing the best shopping experience to people across the globe.
        </p>
      </motion.div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-4xl mx-auto mt-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-muted-foreground text-lg">
          At Mega Mall, we aim to deliver the best of e-commerce—quality products, smooth delivery, and unmatched service. 
          We believe shopping should be easy, secure, and delightful.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center mt-16"
      >
        
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium shadow-lg hover:bg-primary/90 transition"
        >
          <CheckCircle className="w-5 h-5" />
          Start Shopping with Mega Mall
        </Link>
      </motion.div>
    </section>
  );
};

export default AboutPage;

