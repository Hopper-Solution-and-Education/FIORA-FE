import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ExchangeRateItemSkeletonProps {
  count?: number;
}

const ExchangeRateItemSkeleton = ({ count = 3 }: ExchangeRateItemSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`skeleton-${index}`} className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              {/* Left side - Currency information */}
              <div className="flex items-center space-x-4 flex-1">
                {/* From Currency */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" /> {/* Currency icon */}
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-12" /> {/* Currency code like "USD" */}
                    <Skeleton className="h-3 w-8" /> {/* Currency symbol like "$" */}
                  </div>
                </div>

                {/* Arrow/Exchange indicator */}
                <div className="flex items-center">
                  <Skeleton className="h-4 w-6" /> {/* Exchange arrow */}
                </div>

                {/* To Currency */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" /> {/* Currency icon */}
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-12" /> {/* Currency code */}
                    <Skeleton className="h-3 w-8" /> {/* Currency symbol */}
                  </div>
                </div>

                {/* Exchange rate values */}
                <div className="flex items-center space-x-2 ml-4">
                  <Skeleton className="h-4 w-4" /> {/* From value */}
                  <Skeleton className="h-3 w-4" /> {/* "=" symbol */}
                  <Skeleton className="h-4 w-16" /> {/* To value */}
                </div>
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" /> {/* Edit button */}
                <Skeleton className="h-8 w-8 rounded-md" /> {/* Delete button */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ExchangeRateItemSkeleton;
