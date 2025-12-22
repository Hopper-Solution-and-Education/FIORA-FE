'use client';

import { Icons } from '@/components/Icon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props interface for WalletPackageErrorBoundary
 */
interface WalletPackageErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional fallback UI to render when error occurs
   */
  fallback?: ReactNode;
}

/**
 * State interface for WalletPackageErrorBoundary
 */
interface WalletPackageErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component for WalletPackageList
 * Catches rendering errors and displays fallback UI with retry option
 */
class WalletPackageErrorBoundary extends Component<
  WalletPackageErrorBoundaryProps,
  WalletPackageErrorBoundaryState
> {
  constructor(props: WalletPackageErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<WalletPackageErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('WalletPackageErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="py-8">
          <Alert variant="destructive">
            <Icons.alertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">
                An unexpected error occurred while rendering the package list. Please try again.
              </p>
              {this.state.error && (
                <p className="text-xs text-muted-foreground mb-3">
                  Error: {this.state.error.message}
                </p>
              )}
              <Button variant="outline" size="sm" onClick={this.handleReset}>
                <Icons.refreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WalletPackageErrorBoundary;
