
'use client';


import { Suspense, useEffect, useState } from 'react';
import { productService } from '@/services/Api/productService';
import ProductDetailsPage from '@/components/product/ProductDetailsPage';
import ProductDetailsSkeleton from '@/components/product/ProductDetailsSkeleton';
import ErrorBoundary from '@/components/shop/ErrorBoundary';
import { useParams } from 'next/navigation';
import { Product } from '@/types/api';
import { toast } from 'react-toastify';



// // Generate static params for popular products (optional)
// export async function generateStaticParams() {
//   try {
//     const response = await productService.getAllProducts();
//     if (response.success && response.data) {
//       // Generate static pages for first 20 products
//       return response.data.products.slice(0, 20).map((product) => ({
//         id: product._id,
//       }));
//     }
//   } catch (error) {
//     console.error('Error generating static params:', error);
//   }
//   return [];
// }

// // Generate metadata for SEO
// export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
//   try {
//     const response = await productService.getProduct(params.id);
    
//     if (!response.success || !response.data) {
//       return {
//         title: 'Product Not Found - Mega Mall',
//         description: 'The requested product could not be found.',
//       };
//     }

//     const product = response.data;
//     const productImage = product.images?.[0]?.url || '/default-product.jpg';
    
//     return {
//       title: `${product.title} - Mega Mall`,
//       description: product.description.length > 160 
//         ? `${product.description.substring(0, 157)}...` 
//         : product.description,
//       keywords: `${product.title}, ${product.category}, online shopping, mega mall, ${product.title.split(' ').join(', ')}`,
//       openGraph: {
//         title: `${product.title} - Mega Mall`,
//         description: product.description,
//         type: 'website',
//         url: `/product/${product._id}`,
//         images: [
//           {
//             url: productImage,
//             width: 800,
//             height: 600,
//             alt: product.title,
//           },
//         ],
//         siteName: 'Mega Mall',
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title: `${product.title} - Mega Mall`,
//         description: product.description,
//         images: [productImage],
//       },
//       robots: {
//         index: true,
//         follow: true,
//         googleBot: {
//           index: true,
//           follow: true,
//           'max-video-preview': -1,
//           'max-image-preview': 'large',
//           'max-snippet': -1,
//         },
//       },
//       alternates: {
//         canonical: `/product/${product._id}`,
//       },
//     };
//   } catch (error) {
//     console.error('Error generating metadata:', error);
//     return {
//       title: 'Product - Mega Mall',
//       description: 'View product details and add to cart.',
//     };
//   }
// }

// // Enable ISR with revalidation
// export const revalidate = 3600; // Revalidate every hour

export default  function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getProduct(id as string);
        if (response.success && response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product || isLoading) {
    return <ProductDetailsSkeleton />;
  }

    return (
      <ErrorBoundary>
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductDetailsPage product={product!} />
        </Suspense>
      </ErrorBoundary>
    );
}
