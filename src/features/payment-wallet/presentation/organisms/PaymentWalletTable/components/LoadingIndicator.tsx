import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  isLoading: boolean;
  hasData: boolean;
  isLoadingMore?: boolean;
}

const LoadingIndicator = ({ isLoading, hasData, isLoadingMore }: LoadingIndicatorProps) => {
  if (isLoading && !hasData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isLoadingMore && hasData) {
    return <Label>Loading more data...</Label>;
  }

  return null;
};

export default LoadingIndicator;
