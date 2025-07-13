'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Shop Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
              {/* Error Icon */}
              <div className="w-20 h-20 text-destructive">
                <AlertTriangle className="w-full h-full" />
              </div>
              
              {/* Error Message */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground">
                  Something went wrong
                </h2>
                <p className="text-muted-foreground max-w-md">
                  We encountered an unexpected error while loading the shop. 
                  This might be a temporary issue.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left mt-4 p-4 bg-muted rounded-md">
                    <summary className="cursor-pointer font-medium text-sm">
                      Error Details (Development)
                    </summary>
                    <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
                      {this.state.error.message}
                      {'\n'}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
