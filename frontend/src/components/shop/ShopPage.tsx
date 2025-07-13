'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/types/api';
import { productService } from '@/services/Api/productService';
import { toast } from 'react-toastify';
import ProductGrid from './ProductGrid';
import ShopFiltersComponent from './ShopFilters';
import ShopHeader from './ShopHeader';
import LoadingGrid from './LoadingGrid';
import ErrorState from './ErrorState';
export interface ShopFiltersType {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price' | 'rating' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  
  const [filters, setFilters] = useState<ShopFiltersType>({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    searchQuery: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 12;

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);
  
 const applyFiltersAndSort = useCallback(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Apply sorting
    filtered = productService.sortProducts(filtered, filters.sortBy, filters.sortOrder);

    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters]);

  // Apply filters and sorting when products or filters change
  useEffect(() => {
    applyFiltersAndSort();
  }, [ products, filters, applyFiltersAndSort]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await productService.getAllProducts();
      
      if (response.success && response.data) {
        setProducts(response.data.products);
        
        // Extract categories and price range
        const uniqueCategories = productService.getCategories(response.data.products);
        const productPriceRange = productService.getPriceRange(response.data.products);
        
        setCategories(uniqueCategories);
        setPriceRange(productPriceRange);
        setFilters(prev => ({
          ...prev,
          maxPrice: productPriceRange.max,
        }));
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  

  // Get products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleFilterChange = useCallback((newFilters: Partial<ShopFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: '',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      searchQuery: '',
    });
  }, [priceRange.min, priceRange.max]);

  if (error) {
    return <ErrorState message={error} onRetry={fetchProducts} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ShopHeader
          totalProducts={totalProducts}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ShopFiltersComponent
              filters={filters}
              categories={categories}
              priceRange={priceRange}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {isLoading ? (
              <LoadingGrid />
            ) : (
              <ProductGrid
                products={paginatedProducts}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
