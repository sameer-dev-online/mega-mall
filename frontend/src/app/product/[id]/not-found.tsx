import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, ArrowLeft, Search } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
          {/* 404 Icon */}
          <div className="w-24 h-24 text-muted-foreground">
            <ShoppingBag className="w-full h-full" />
          </div>
          
          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              Product Not Found
            </h1>
            <p className="text-muted-foreground max-w-md">
              Sorry, we couldn&apos;t find the product you&apos;re looking for.
              It may have been removed or the link might be incorrect.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Button asChild className="flex-1">
              <Link href="/shop" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Browse Products
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
          </div>
          
          {/* Additional Help */}
          <div className="text-sm text-muted-foreground">
            <p>Need help? <Link href="/contact" className="text-primary hover:underline">Contact us</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
