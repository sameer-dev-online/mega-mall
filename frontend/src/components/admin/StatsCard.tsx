"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
    period?: string;
  };
  loading?: boolean;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading = false,
  color = 'default',
  size = 'md'
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'text-primary';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          padding: 'p-4',
          titleSize: 'text-sm',
          valueSize: 'text-lg',
          iconSize: 'h-5 w-5'
        };
      case 'lg':
        return {
          padding: 'p-8',
          titleSize: 'text-base',
          valueSize: 'text-3xl',
          iconSize: 'h-10 w-10'
        };
      default:
        return {
          padding: 'p-6',
          titleSize: 'text-sm',
          valueSize: 'text-2xl',
          iconSize: 'h-8 w-8'
        };
    }
  };

  const sizeClasses = getSizeClasses(size);
  const colorClasses = getColorClasses(color);

  if (loading) {
    return (
      <Card>
        <CardContent className={sizeClasses.padding}>
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              {description && <Skeleton className="h-3 w-32" />}
            </div>
            <Skeleton className={`${sizeClasses.iconSize} rounded`} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className={sizeClasses.padding}>
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1">
            <p className={`${sizeClasses.titleSize} font-medium text-muted-foreground`}>
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <p className={`${sizeClasses.valueSize} font-bold ${colorClasses}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {trend && (
                <Badge 
                  variant={trend.isPositive ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {trend.isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            {trend?.period && (
              <p className="text-xs text-muted-foreground">
                vs {trend.period}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={`${colorClasses} opacity-80`}>
              <Icon className={sizeClasses.iconSize} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
