import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import OrderConfirmationPage from '@/components/checkout/OrderConfirmationPage';
import CheckoutSkeleton from '@/components/checkout/CheckoutSkeleton';
import ErrorBoundary from '@/components/shop/ErrorBoundary';

interface OrderConfirmationProps {
  params: {
    orderId: string;
  };
}

export async function generateMetadata({ params }: OrderConfirmationProps): Promise<Metadata> {
  return {
    title: `Order Confirmation - ${params.orderId} | Mega Mall`,
    description: 'Your order has been successfully placed. View your order details and tracking information.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function OrderConfirmation({ params }: OrderConfirmationProps) {
  if (!params.orderId) {
    notFound();
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<CheckoutSkeleton />}>
        <OrderConfirmationPage orderId={params.orderId} />
      </Suspense>
    </ErrorBoundary>
  );
}
