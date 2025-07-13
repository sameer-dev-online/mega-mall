'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopFiltersType } from './ShopPage';

interface ShopFiltersProps {
  filters: ShopFiltersType;
  categories: string[];
  priceRange: { min: number; max: number };
  onFilterChange: (filters: Partial<ShopFiltersType>) => void;
  onClearFilters: () => void;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  filters,
  categories,
  priceRange,
  onFilterChange,
  onClearFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: false,
  });

  const [localPriceRange, setLocalPriceRange] = useState([
    filters.minPrice,
    filters.maxPrice,
  ]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
    onFilterChange({
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const handleCategorySelect = (category: string) => {
    onFilterChange({
      category: filters.category === category ? '' : category,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) count++;
    if (filters.searchQuery) count++;
    return count;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left"
          >
            <Label className="text-sm font-medium">Categories</Label>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        filters.category === category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="capitalize">{category}</span>
                        {filters.category === category && (
                          <X className="w-3 h-3" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left"
          >
            <Label className="text-sm font-medium">Price Range</Label>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-4"
              >
                <div className="px-2">
                  <Slider
                    value={localPriceRange}
                    onValueChange={handlePriceChange}
                    max={priceRange.max}
                    min={priceRange.min}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(localPriceRange[0])}</span>
                  <span>{formatPrice(localPriceRange[1])}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="min-price" className="text-xs">Min</Label>
                    <Input
                      id="min-price"
                      type="number"
                      value={localPriceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        const newRange = [value, localPriceRange[1]];
                        setLocalPriceRange(newRange);
                        handlePriceChange(newRange);
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-price" className="text-xs">Max</Label>
                    <Input
                      id="max-price"
                      type="number"
                      value={localPriceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || priceRange.max;
                        const newRange = [localPriceRange[0], value];
                        setLocalPriceRange(newRange);
                        handlePriceChange(newRange);
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => onFilterChange({ category: '' })}
                >
                  {filters.category}
                  <X className="w-3 h-3" />
                </Badge>
              )}
              {(filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => onFilterChange({ 
                    minPrice: priceRange.min, 
                    maxPrice: priceRange.max 
                  })}
                >
                  {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                  <X className="w-3 h-3" />
                </Badge>
              )}
              {filters.searchQuery && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => onFilterChange({ searchQuery: '' })}
                >
                  &ldquo;{filters.searchQuery}&rdquo;
                  <X className="w-3 h-3" />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopFilters;
