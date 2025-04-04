'use client';

import { Skeleton } from '@/components/ui/skeleton';

const ChartSkeleton = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200">
      {/* Header Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-6 w-48 mx-auto" />
      </div>

      {/* Chart Container Skeleton */}
      <div className="space-y-4">
        {/* Total Bar Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Account Bars Skeleton */}
        {[1, 2, 3].map((index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}

        {/* Legend Skeleton */}
        <div className="flex flex-wrap gap-4 mt-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
