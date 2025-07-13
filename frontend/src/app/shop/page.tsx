import { Metadata } from 'next';
import { Suspense } from 'react';
import ShopPage from '@/components/shop/ShopPage';
import ErrorBoundary from '@/components/shop/ErrorBoundary';
import LoadingGrid from '@/components/shop/LoadingGrid';

export const metadata: Metadata = {
  title: 'Shop - Mega Mall | Premium Products & Best Deals',
  description: 'Discover our extensive collection of premium products at unbeatable prices. Shop electronics, fashion, home goods, and more with fast shipping and excellent customer service.',
  keywords: 'shop, products, electronics, fashion, home goods, deals, online shopping, mega mall',
  openGraph: {
    title: 'Shop - Mega Mall | Premium Products & Best Deals',
    description: 'Discover our extensive collection of premium products at unbeatable prices.',
    type: 'website',
    url: '/shop',
    images: [
      {
        url: '/og-shop.jpg',
        width: 1200,
        height: 630,
        alt: 'Mega Mall Shop - Premium Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop - Mega Mall | Premium Products & Best Deals',
    description: 'Discover our extensive collection of premium products at unbeatable prices.',
    images: ['/og-shop.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default function Shop() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ShopPageSkeleton />}>
        <ShopPage />
      </Suspense>
    </ErrorBoundary>
  );
}

// Loading skeleton for the entire shop page
function ShopPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="space-y-6 mb-8">
          <div className="text-center space-y-2">
            <div className="h-10 bg-muted rounded animate-pulse w-64 mx-auto" />
            <div className="h-4 bg-muted rounded animate-pulse w-96 mx-auto" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="h-10 bg-muted rounded animate-pulse w-80" />
            <div className="h-10 bg-muted rounded animate-pulse w-48" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar Skeleton */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="h-96 bg-muted rounded-xl animate-pulse" />
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1">
            <LoadingGrid />
          </main>
        </div>
      </div>
    </div>
  );
}
