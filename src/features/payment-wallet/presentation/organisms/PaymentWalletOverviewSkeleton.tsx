import { Skeleton } from '@/components/ui/skeleton';

const PaymentWalletOverviewSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Top Row - Main Metrics + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-24" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-24" />
          </div>
        </div>

        {/* Percentage Card */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-16" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-start gap-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Bottom Row - Balance Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-lg border p-4">
            <div className="flex items-center justify-between pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentWalletOverviewSkeleton;
