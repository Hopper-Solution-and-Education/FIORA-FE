import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/shared/utils';

interface Props {
  className?: string;
  rows?: number;
  cols?: number;
}

const ScatterRankingChartSkeleton = ({ className, rows = 5, cols = 5 }: Props) => {
  return (
    <div
      className={cn(
        'w-full rounded-lg p-2 bg-white dark:bg-gray-900 min-h-[400px] md:min-h-[700px] border border-gray-100 dark:border-gray-800',
        className,
      )}
    >
      {/* Title skeleton */}
      <div className="p-4 pb-7 font-bold text-lg">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex justify-end">
        <div className="relative w-full min-h-[400px] md:min-h-[700px]">
          {/* Y-axis legend skeleton */}
          {/* <div
            className="absolute top-0 left-1 flex flex-col justify-center items-center"
            style={{ height: 'calc(100% - 80px)', width: '40px', zIndex: 2, gap: '10px' }}
          >
            {[...Array(rows)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-8" />
            ))}
          </div> */}

          {/* X-axis legend skeleton */}
          {/* <div
            className="absolute left-1/2"
            style={{ transform: 'translateX(-50%)', bottom: '0px', zIndex: 2 }}
          >
            <Skeleton className="h-4 w-32" />
          </div> */}
          {/* Chart grid skeleton */}
          <div
            className="absolute top-0 left-[120px] w-[calc(100%-200px)] h-[calc(100%-10px)] grid"
            style={{
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}
          >
            {[...Array(rows * cols)].map((_, i) => (
              <Skeleton key={i} className="m-2 h-12 w-12 md:h-20 md:w-20 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScatterRankingChartSkeleton;
