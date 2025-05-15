'use client';
import { cn } from '@/shared/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface StackedBarChartSkeletonProps {
  className?: string;
}
const StackedBarChartSkeleton = ({ className }: StackedBarChartSkeletonProps) => {
  return (
    <div
      className={cn(
        'w-full mx-auto bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-6 h-6 rounded-md" />
        <Skeleton className="h-5 w-20" />
      </div>
      {/* Rows */}
      <div>
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="space-y-1">
            {/* Top text (T → B) */}
            <div className="flex justify-end">
              <Skeleton className="w-40 h-4" />
            </div>
            {/* Bar + Label */}
            <div className="relative h-8 w-full rounded-md overflow-hidden">
              <Skeleton className="w-full h-full rounded-md" />
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Skeleton className="w-24 h-4" />
              </div>
            </div>
            {/* Bottom text (R: ...) */}
            <div className="flex justify-end">
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex gap-3 justify-center">
        {['Expense', 'Income', 'Profit'].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-sm" />
            <Skeleton className="w-12 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default StackedBarChartSkeleton;
