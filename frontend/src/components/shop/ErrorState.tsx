'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
          {/* Error Icon */}
          <div className="w-16 h-16 text-destructive">
            <AlertCircle className="w-full h-full" />
          </div>
          
          {/* Error Message */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Oops! Something went wrong
            </h3>
            <p className="text-muted-foreground">
              {message}
            </p>
          </div>
          
          {/* Retry Button */}
          <Button
            onClick={onRetry}
            className="flex items-center gap-2"
            size="lg"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;
