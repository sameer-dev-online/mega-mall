"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,

  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T, index: number) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  actions?: DataTableAction<T>[];
  onRefresh?: () => void;
  onExport?: () => void;
  pageSize?: number;
  emptyMessage?: string;
  emptyIcon?: React.ComponentType<{ className?: string }>;
}

function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  title,
  description,
  loading = false,
  error,
  searchable = true,
  searchPlaceholder = "Search...",
  actions = [],
  onRefresh,
  onExport,
  pageSize = 10,
  emptyMessage = "No data available",
  emptyIcon: EmptyIcon
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter(row => {
      return columns.some(column => {
        // If filterable is explicitly set to false, skip this column
        if (column.filterable === false) return false;

        const value = typeof column.key === 'string' && column.key.includes('.')
          ? column.key.split('.').reduce((obj: Record<string, unknown>, key: string) => obj?.[key] as Record<string, unknown>, row as Record<string, unknown>)
          : row[column.key as keyof T];

        return String(value || '').toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = typeof sortConfig.key === 'string' && sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((obj: Record<string, unknown>, key: string) => obj?.[key] as Record<string, unknown>, a as Record<string, unknown>)
        : a[sortConfig.key as keyof T];
      const bValue = typeof sortConfig.key === 'string' && sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((obj: Record<string, unknown>, key: string) => obj?.[key] as Record<string, unknown>, b as Record<string, unknown>)
        : b[sortConfig.key as keyof T];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Convert to strings for comparison if they're not numbers
      const aCompare = typeof aValue === 'number' ? aValue : String(aValue).toLowerCase();
      const bCompare = typeof bValue === 'number' ? bValue : String(bValue).toLowerCase();

      if (aCompare < bCompare) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aCompare > bCompare) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = (columnKey: keyof T | string) => {
    setSortConfig(current => {
      if (current?.key === columnKey) {
        return current.direction === 'asc' 
          ? { key: columnKey, direction: 'desc' }
          : null;
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  };

  // Reset to first page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data, searchQuery]);

  // Get cell value
  const getCellValue = (row: T, column: Column<T>, index: number) => {
    const value = typeof column.key === 'string' && column.key.includes('.')
      ? column.key.split('.').reduce((obj: Record<string, unknown>, key: string) => obj?.[key] as Record<string, unknown>, row as Record<string, unknown>)
      : row[column.key as keyof T];

    if (column.render) {
      return column.render(value, row, index);
    }

    // Handle null/undefined values
    if (value == null) return '';

    // Handle boolean values
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';

    // Handle arrays
    if (Array.isArray(value)) return value.join(', ');

    // Handle objects (display as JSON string)
    if (typeof value === 'object') return JSON.stringify(value);

    return String(value);
  };

  // Render sort icon
  const renderSortIcon = (columnKey: keyof T | string) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === 'asc' 
        ? <ChevronUp className="h-4 w-4" />
        : <ChevronDown className="h-4 w-4" />;
    }
    return null;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-destructive mb-4">
            <h3 className="text-lg font-semibold">Error loading data</h3>
            <p className="text-sm">{error}</p>
          </div>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {(title || description || searchable || onRefresh || onExport) && (
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            
            <div className="flex items-center space-x-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              )}
              
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
              
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        {loading ? (
          <div className="p-6">
            <div className="space-y-3">
              {Array.from({ length: pageSize }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="p-8 text-center">
            {EmptyIcon && <EmptyIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
            <h3 className="text-lg font-semibold mb-2">No data found</h3>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                          column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''
                        } ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                        style={{ width: column.width }}
                        onClick={() => column.sortable && handleSort(column.key)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.title}</span>
                          {column.sortable && renderSortIcon(column.key)}
                        </div>
                      </th>
                    ))}
                    {actions.length > 0 && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-muted/50">
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''
                          }`}
                        >
                          {getCellValue(row, column, rowIndex)}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {actions.length === 1 ? (
                            <Button
                              variant={actions[0].variant || 'outline'}
                              size="sm"
                              onClick={() => actions[0].onClick(row, rowIndex)}
                              disabled={actions[0].disabled?.(row)}
                            >
                              {actions[0].icon && React.createElement(actions[0].icon, { className: "h-4 w-4 mr-1" })}
                              {actions[0].label}
                            </Button>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {actions.map((action, actionIndex) => (
                                  <DropdownMenuItem
                                    key={actionIndex}
                                    onClick={() => action.onClick(row, rowIndex)}
                                    disabled={action.disabled?.(row)}
                                  >
                                    {action.icon && React.createElement(action.icon, { className: "h-4 w-4 mr-2" })}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {sortedData.length > 0 ? (
                      <>
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
                      </>
                    ) : (
                      'No results to display'
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {(() => {
                        const maxVisiblePages = 5;
                        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);

                        return Array.from({ length: endPage - adjustedStartPage + 1 }, (_, i) => {
                          const page = adjustedStartPage + i;
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          );
                        });
                      })()}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default DataTable;

