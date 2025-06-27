'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface CurrentTierMembershipSkeletonProps {
  showStory?: boolean;
}

const CurrentTierMembershipSkeleton = ({
  showStory = false,
}: CurrentTierMembershipSkeletonProps) => {
  return (
    <div className="space-y-6 col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-4 shadow rounded-lg">
      {/* Settings Panel */}
      <div className="p-4">
        <div className="flex justify-start items-start gap-4">
          {/* Title skeleton */}
          <Skeleton className="sm:text-sm md:text-lg lg:text-xl font-bold mb-3 w-full h-6" />
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Image skeleton */}
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5 flex justify-center items-center">
            <Skeleton className="w-full max-h-[200px] h-[200px] rounded-lg" />
          </div>

          {/* TierRank skeleton */}
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-7">
            <div className="space-y-2">
              {/* Tier data items skeleton */}
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 w-full overflow-hidden"
                >
                  {/* Label skeleton */}
                  <Skeleton className="text-xs sm:text-sm md:text-sm lg:text-sm font-semibold text-right flex-shrink-0 h-4 w-16" />
                  {/* Value container skeleton */}
                  <div className="flex-shrink-0 w-20 text-left overflow-hidden">
                    <div className="flex items-center gap-2">
                      <Skeleton className="text-sm md:text-base truncate h-4 w-12" />
                      <Skeleton className="text-xs sm:text-sm md:text-sm lg:text-sm flex-shrink-0 h-3 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Story section skeleton */}
      {showStory && (
        <div className="rounded-lg shadow p-4">
          <Skeleton className="text-xl font-bold mb-4 h-6 w-16" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentTierMembershipSkeleton;
