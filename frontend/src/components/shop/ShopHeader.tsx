'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { ShopFiltersType } from './ShopPage';

interface ShopHeaderProps {
  totalProducts: number;
  filters: ShopFiltersType;
  onFilterChange: (filters: Partial<ShopFiltersType>) => void;
  onClearFilters: () => void;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({
  totalProducts,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  // Update search input when filters change externally
  useEffect(() => {
    setSearchInput(filters.searchQuery);
  }, [filters.searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ searchQuery: searchInput });
  };

  const handleSearchClear = () => {
    setSearchInput('');
    onFilterChange({ searchQuery: '' });
  };

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First', sortBy: 'createdAt' as const, sortOrder: 'desc' as const },
    { value: 'createdAt-asc', label: 'Oldest First', sortBy: 'createdAt' as const, sortOrder: 'asc' as const },
    { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price' as const, sortOrder: 'asc' as const },
    { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price' as const, sortOrder: 'desc' as const },
    { value: 'rating-desc', label: 'Highest Rated', sortBy: 'rating' as const, sortOrder: 'desc' as const },
    { value: 'rating-asc', label: 'Lowest Rated', sortBy: 'rating' as const, sortOrder: 'asc' as const },
  ];

  const currentSortOption = sortOptions.find(
    option => option.sortBy === filters.sortBy && option.sortOrder === filters.sortOrder
  );

  const handleSortChange = (sortBy: 'price' | 'rating' | 'createdAt', sortOrder: 'asc' | 'desc') => {
    onFilterChange({ sortBy, sortOrder });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.searchQuery) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 1000) count++;
    return count;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Shop Our Products
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our extensive collection of premium products at unbeatable prices
        </p>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[180px] justify-between">
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  {currentSortOption?.label || 'Sort by'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.sortBy, option.sortOrder)}
                  className={`cursor-pointer ${
                    currentSortOption?.value === option.value ? 'bg-accent' : ''
                  }`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Summary and Active Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Results Count */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Showing {totalProducts} product{totalProducts !== 1 ? 's' : ''}
          </span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">
              {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
            </Badge>
          )}
        </div>

        {/* Clear Filters */}
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => onFilterChange({ category: '' })}
            >
              Category: {filters.category}
              <X className="w-3 h-3" />
            </Badge>
          )}
          {filters.searchQuery && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => onFilterChange({ searchQuery: '' })}
            >
              Search: "{filters.searchQuery}"
              <X className="w-3 h-3" />
            </Badge>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => onFilterChange({ minPrice: 0, maxPrice: 1000 })}
            >
              Price: ${filters.minPrice} - ${filters.maxPrice}
              <X className="w-3 h-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopHeader;
