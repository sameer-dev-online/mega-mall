'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Product } from "@/types/api";
import { useState } from "react"
import { useCart } from "@/contexts/CartContext";
import { Input } from "../ui/input"


type ProductCardProps = {
  product: Product;
  badge?: "New Arrival";
}



export const ProductCard = ({
  product,
  badge,
}: ProductCardProps) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, isUpdating } = useCart();

    const onAddToCart = async(productId: string, quantity: number) => {
      await addToCart(productId, quantity);
    }
    
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="w-full max-w-sm shadow-xl rounded-2xl overflow-hidden border hover:shadow-2xl transition-shadow duration-300" >
        {/* Image Section */}
        <div className="relative w-full h-64 bg-muted">
          {product && product.images.map((image, index) =>
         <Image
            key={index}
            src={image.url}
            alt={
                product.title
            }
            fill
            className="object-cover"
          />
        )}
          {badge && (
            <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700">
              {badge}
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="p-4 space-y-3">
          <h3 className="text-lg font-semibold line-clamp-2">{product.title}</h3>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">${product.price}</span>

            {/* Add to Cart Button */}
            <div className="flex gap-1">
              <Input
                type="number"
                min={1}
                pattern="[0-9]*"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-10 h-9 text-center bg-transparent border border-primary"
              />
              <Button
                size="sm"
                variant="default"
                onClick={() => onAddToCart(product._id, quantity)}
                disabled={isUpdating}
                className="gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                {isUpdating ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
