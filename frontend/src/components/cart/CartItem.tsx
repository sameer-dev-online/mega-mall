"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CartItemProps } from "@/types/api";

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityUpdate,
  onRemove,
  isUpdating
}) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isLocalUpdating, setIsLocalUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity === item.quantity) return;
    
    setIsLocalUpdating(true);
    setLocalQuantity(newQuantity);
    
    const success = await onQuantityUpdate(item.productId, newQuantity);
    if (!success) {
      // Revert local quantity if update failed
      setLocalQuantity(item.quantity);
    }
    setIsLocalUpdating(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setLocalQuantity(value);
    }
  };

  const handleInputBlur = () => {
    if (localQuantity !== item.quantity) {
      handleQuantityChange(localQuantity);
    }
  };

  const handleRemove = async () => {
    setIsLocalUpdating(true);
    await onRemove(item.productId);
    setIsLocalUpdating(false);
  };

  const itemTotal = item?.price * item?.quantity || 0;
  const isDisabled = isUpdating || isLocalUpdating;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Product Image */}
            <div className="relative w-full sm:w-20 md:w-24 h-40 sm:h-20 md:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {item.images && item.images.length > 0 ? (
                <Image
                  src={item.images[0].url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
              
              {/* Stock Badge */}
              {item.stock < 10 && (
                <Badge 
                  variant="destructive" 
                  className="absolute top-2 left-2 text-xs"
                >
                  Low Stock
                </Badge>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 hidden sm:block">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                    <span className="text-base sm:text-lg font-bold text-primary">
                      ${Number(item.price).toFixed(2)}
                    </span>

                    {item.stock > 0 ? (
                      <Badge variant="secondary" className="text-xs">
                        {item.stock} in stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Out of stock
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Price and Total */}
                <div className="text-right sm:text-right">
                  <div className="text-xs sm:text-sm text-gray-600">Total</div>
                  <div className="text-lg sm:text-xl font-bold text-gray-900">
                    ${Number(itemTotal).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Quantity Controls and Remove Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden sm:block">Quantity:</span>
                  
                  <div className="flex items-center gap-1 border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(localQuantity - 1)}
                      disabled={isDisabled || localQuantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    
                    <Input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={localQuantity}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      disabled={isDisabled}
                      className="w-16 h-8 text-center border-0 bg-transparent focus:ring-0"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(localQuantity + 1)}
                      disabled={isDisabled || localQuantity >= item.stock}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {isLocalUpdating && (
                    <LoaderCircle className="w-4 h-4 animate-spin text-primary" />
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isDisabled}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  <span className="sm:hidden">Remove Item</span>
                  <span className="hidden sm:inline">Remove</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CartItem;
