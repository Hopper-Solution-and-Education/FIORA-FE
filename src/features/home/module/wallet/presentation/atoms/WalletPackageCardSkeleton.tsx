'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const WalletPackageCardSkeleton: React.FC = () => {
  return (
    <Card className="flex items-center gap-4 p-4 border-2">
      <Skeleton className="w-12 h-12 rounded-md flex-shrink-0" />

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
    </Card>
  );
};

export default WalletPackageCardSkeleton;
