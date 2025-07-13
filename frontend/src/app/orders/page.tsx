import { Metadata } from 'next';
import { Suspense } from 'react';
import OrderHistoryPage from '@/components/checkout/OrderHistoryPage';
import CheckoutSkeleton from '@/components/checkout/CheckoutSkeleton';
import ErrorBoundary from '@/components/shop/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Order History - Mega Mall | Track Your Orders',
  description: 'View your order history, track current orders, and manage your purchases with Mega Mall.',
  keywords: 'order history, track orders, order status, mega mall orders',
  openGraph: {
    title: 'Order History - Mega Mall | Track Your Orders',
    description: 'View your order history and track current orders.',
    type: 'website',
    url: '/orders',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Orders() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<CheckoutSkeleton />}>
        <OrderHistoryPage />
      </Suspense>
    </ErrorBoundary>
  );
}
