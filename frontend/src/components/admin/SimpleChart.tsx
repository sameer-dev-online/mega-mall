"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  height?: number;
}

interface SimpleProgressChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  title,
  description,
  data,
  height = 200
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3" style={{ height }}>
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-muted-foreground truncate">
                {item.label}
              </div>
              <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.color || 'bg-primary'
                  }`}
                  style={{
                    width: `${(item.value / maxValue) * 100}%`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-end pr-2">
                  <span className="text-xs font-medium text-foreground">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const SimpleProgressChart: React.FC<SimpleProgressChartProps> = ({
  title,
  description,
  data
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">
                    {item.value.toLocaleString()} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.color || 'bg-primary'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

interface SimpleLineChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  height?: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  title,
  description,
  data,
  height = 200
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 200"
            className="overflow-visible"
          >
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="400"
                y2={i * 40}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
              />
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
              points={data
                .map((point, index) => {
                  const x = (index / (data.length - 1)) * 400;
                  const y = range > 0 
                    ? 200 - ((point.value - minValue) / range) * 200
                    : 100;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
            
            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 400;
              const y = range > 0 
                ? 200 - ((point.value - minValue) / range) * 200
                : 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="currentColor"
                  className="text-primary"
                />
              );
            })}
          </svg>
          
          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            {data.map((point, index) => (
              <span key={index} className="truncate max-w-16">
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
