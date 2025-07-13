'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Product page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
          {/* Error Icon */}
          <div className="w-20 h-20 text-destructive">
            <AlertTriangle className="w-full h-full" />
          </div>
          
          {/* Error Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              Something went wrong!
            </h2>
            <p className="text-muted-foreground max-w-md">
              We encountered an error while loading this product page. 
              This might be a temporary issue.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mt-4 p-4 bg-muted rounded-md">
                <summary className="cursor-pointer font-medium text-sm">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Button
              onClick={reset}
              className="flex-1 flex items-center gap-2"
              size="lg"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex-1 flex items-center gap-2"
              size="lg"
            >
              <Link href="/shop">
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Link>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            asChild
            className="flex items-center gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
