import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import React from 'react';

interface TableSkeletonRowProps {
  columns?: number;
  className?: string;
}

const TableSkeletonRow = ({ columns = 7, className }: TableSkeletonRowProps) => {
  const skeletonWidths = ['w-20', 'w-24', 'w-16', 'w-24', 'w-20', 'w-16', 'w-20'];

  return (
    <TableRow className={className}>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index} className="text-center">
          <div className="flex justify-center">
            <Skeleton className={`h-4 ${skeletonWidths[index] || 'w-20'}`} />
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableSkeletonRow;
