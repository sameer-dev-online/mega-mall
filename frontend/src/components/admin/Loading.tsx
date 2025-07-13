"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  rows?: number;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  fullScreen = false,
  rows = 5
}) => {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          spinner: 'h-4 w-4',
          text: 'text-sm',
          container: 'p-4'
        };
      case 'lg':
        return {
          spinner: 'h-8 w-8',
          text: 'text-lg',
          container: 'p-8'
        };
      default:
        return {
          spinner: 'h-6 w-6',
          text: 'text-base',
          container: 'p-6'
        };
    }
  };

  const sizeClasses = getSizeClasses(size);

  const renderSpinner = () => (
    <div className={`flex flex-col items-center justify-center ${sizeClasses.container}`}>
      <Loader2 className={`${sizeClasses.spinner} animate-spin text-primary`} />
      {text && (
        <p className={`mt-2 ${sizeClasses.text} text-muted-foreground`}>
          {text}
        </p>
      )}
    </div>
  );

  const renderSkeleton = () => (
    <div className={sizeClasses.container}>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderDots = () => (
    <div className={`flex items-center justify-center ${sizeClasses.container}`}>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} bg-primary rounded-full animate-pulse`}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
      {text && (
        <p className={`ml-3 ${sizeClasses.text} text-muted-foreground`}>
          {text}
        </p>
      )}
    </div>
  );

  const renderPulse = () => (
    <div className={`flex flex-col items-center justify-center ${sizeClasses.container}`}>
      <div className={`${sizeClasses.spinner} bg-primary rounded-full animate-pulse`} />
      {text && (
        <p className={`mt-2 ${sizeClasses.text} text-muted-foreground animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'skeleton':
        return renderSkeleton();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-0">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return renderContent();
};

// Specialized loading components
export const TableLoading: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-12 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const CardLoading: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const FormLoading: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <div className="flex justify-end space-x-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export const DashboardLoading: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Loading;
