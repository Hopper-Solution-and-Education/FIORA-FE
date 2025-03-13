import { cn } from '@/shared/utils';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  /**
   * The size of the loading indicator
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg' | 'xl';

  /**
   * Optional text to display below the spinner
   */
  text?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Center the loading indicator in its container
   * @default false
   */
  centered?: boolean;
}

export function LoadingIndicator({
  size = 'default',
  text,
  className,
  centered = false,
}: LoadingIndicatorProps) {
  // Map size to appropriate classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Container classes
  const containerClasses = cn(
    'flex flex-col items-center',
    centered && 'justify-center min-h-[100px]',
    className,
  );

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <Loader2 className={cn('text-primary animate-spin', sizeClasses[size])} />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
