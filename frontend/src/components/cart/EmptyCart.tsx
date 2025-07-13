"use client";

import { ShoppingBag, ArrowRight, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { EmptyCartProps } from "@/types/api";

const EmptyCart: React.FC<EmptyCartProps> = ({ onContinueShopping }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 sm:p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Empty Cart Icon */}
            <div className="relative mx-auto w-24 sm:w-32 h-24 sm:h-32">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center"
              >
                <ShoppingBag className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400" />
              </motion.div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ 
                  y: [-5, 5, -5],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5
                }}
                className="absolute -top-2 -right-2"
              >
                <Heart className="w-6 h-6 text-red-300" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [5, -5, 5],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 1
                }}
                className="absolute -bottom-2 -left-2"
              >
                <Star className="w-5 h-5 text-yellow-300" />
              </motion.div>
            </div>

            {/* Main Message */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Your cart is empty
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet.
                Start shopping to fill it up with amazing products!
              </p>
            </div>

            {/* Action Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onContinueShopping}
                size="lg"
                className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Suggestions */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Popular Categories
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { name: "Electronics", emoji: "📱" },
                  { name: "Fashion", emoji: "👕" },
                  { name: "Home & Garden", emoji: "🏠" },
                  { name: "Sports", emoji: "⚽" }
                ].map((category, index) => (
                  <motion.button
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onContinueShopping}
                    className="p-2 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-center"
                  >
                    <div className="text-xl sm:text-2xl mb-1">{category.emoji}</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">
                      {category.name}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-600 text-center">
                    Free shipping on orders over $50
                  </span>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">↩</span>
                  </div>
                  <span className="text-gray-600 text-center">
                    30-day return policy
                  </span>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">🔒</span>
                  </div>
                  <span className="text-gray-600 text-center">
                    Secure checkout
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyCart;
