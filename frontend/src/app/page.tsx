import { Metadata } from 'next';
import { Suspense } from 'react';
import HomePage from '@/components/home/HomePage';
import HomePageSkeleton from '@/components/home/HomePageSkeleton';
import ErrorBoundary from '@/components/shop/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Mega Mall - Your Ultimate Shopping Destination | Premium Products & Best Deals',
  description: 'Discover thousands of premium products at unbeatable prices. Shop electronics, fashion, home goods, and more with free shipping, secure payment, and easy returns at Mega Mall.',
  keywords: 'online shopping, electronics, fashion, home goods, deals, free shipping, mega mall, e-commerce, premium products',
  openGraph: {
    title: 'Mega Mall - Your Ultimate Shopping Destination',
    description: 'Discover thousands of premium products at unbeatable prices with free shipping and easy returns.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Mega Mall - Premium Shopping Experience',
      },
    ],
    siteName: 'Mega Mall',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mega Mall - Your Ultimate Shopping Destination',
    description: 'Discover thousands of premium products at unbeatable prices with free shipping and easy returns.',
    images: ['/og-home.jpg'],
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
  alternates: {
    canonical: '/',
  },
};

// Enable static generation with revalidation
export const revalidate = 1800; // Revalidate every 30 minutes

export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<HomePageSkeleton />}>
        <HomePage />
      </Suspense>
    </ErrorBoundary>
  );
}
