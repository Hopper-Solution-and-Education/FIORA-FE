import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface TableSkeletonRowProps {
  columns?: number;
  className?: string;
}

const TableSkeletonRow = ({ columns = 10, className }: TableSkeletonRowProps) => {
  const skeletonWidths = [
    'w-10',
    'w-32',
    'w-20',
    'w-40',
    'w-24',
    'w-32',
    'w-24',
    'w-20',
    'w-20',
    'w-12',
  ];

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
