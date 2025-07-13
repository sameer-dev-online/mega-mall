import axiosInstance from '@/lib/axious';
import {
  ApiResponse,
  Product,
  Review,
  ReviewData,
  ProductQueryParams,
  PaginationParams,
  GetALLProducts
} from '@/types/api';

class ProductService {
  // Product Retrieval
  async getAllProducts(): Promise<ApiResponse<GetALLProducts>> {
    const response = await axiosInstance.get('/product/get-all-products');
    // console.log(response.data)
    return response.data;
  }

  async getProduct(productId: string): Promise<ApiResponse<Product>> {
    const response = await axiosInstance.get(`/product/get-product/${productId}`);
    // console.log(response.data)
    return response.data;
  }

  async getProductsByCategory(params: ProductQueryParams = {}): Promise<ApiResponse<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
  }>> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await axiosInstance.get(`/product/get-product-by-category?${queryParams.toString()}`);
    return response.data;
  }

  async searchProducts(query: string, params: PaginationParams = {}): Promise<ApiResponse<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
  }>> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());

    const response = await axiosInstance.get(`/product/get-product-by-query?${queryParams.toString()}`, {
      data: { query }
    });
    return response.data;
  }

  // Reviews
  async addReview(productId: string, reviewData: ReviewData): Promise<ApiResponse<Review>> {
    const response = await axiosInstance.post(`/product/reviews/${productId}`, reviewData);
    return response.data;
  }

  async getReviews(productId: string): Promise<ApiResponse<{ reviews: Review[] }>> {
    const response = await axiosInstance.get(`/product/get-reviews/${productId}`);
    return response.data;
  }

  // Utility methods for filtering and sorting
  filterProducts(products: Product[], filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  }): Product[] {
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;
      if (filters.minRating && (product.averageRating || 0) < filters.minRating) return false;
      return true;
    });
  }

  sortProducts(products: Product[], sortBy: 'price' | 'rating' | 'createdAt', order: 'asc' | 'desc' = 'asc'): Product[] {
    return [...products].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = (a.averageRating || 0) - (b.averageRating || 0);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return order === 'desc' ? -comparison : comparison;
    });
  }

  // Get unique categories from products
  getCategories(products: Product[]): string[] {
    const categories = products.map(product => product.category);
    return [...new Set(categories)];
  }

  // Get price range from products
  getPriceRange(products: Product[]): { min: number; max: number } {
    if (products.length === 0) return { min: 0, max: 0 };
    
    const prices = products.map(product => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
}

export const productService = new ProductService();
