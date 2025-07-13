import { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutPage from '@/components/checkout/CheckoutPage';
import CheckoutSkeleton from '@/components/checkout/CheckoutSkeleton';
import ErrorBoundary from '@/components/shop/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Checkout - Mega Mall | Secure Order Placement',
  description: 'Complete your order securely with our easy checkout process. Cash on delivery available with fast shipping and excellent customer service.',
  keywords: 'checkout, order, payment, cash on delivery, COD, secure checkout, mega mall',
  openGraph: {
    title: 'Checkout - Mega Mall | Secure Order Placement',
    description: 'Complete your order securely with our easy checkout process.',
    type: 'website',
    url: '/checkout',
  },
  twitter: {
    card: 'summary',
    title: 'Checkout - Mega Mall | Secure Order Placement',
    description: 'Complete your order securely with our easy checkout process.',
  },
  robots: {
    index: false, // Don't index checkout pages
    follow: false,
  },
};

export default function Checkout() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutPage />
      </Suspense>
    </ErrorBoundary>
  );
}
