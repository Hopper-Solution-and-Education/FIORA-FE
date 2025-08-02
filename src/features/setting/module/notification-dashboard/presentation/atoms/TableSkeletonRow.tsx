import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { getSkeletonAlignClass } from '../utils/convertTableUtils';

interface TableSkeletonRowProps {
  columns?: string[];
  className?: string;
}

const TableSkeletonRow = ({ columns = [], className }: TableSkeletonRowProps) => {
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
      {columns.map((col, index) => {
        const { cellClass, flexClass } = getSkeletonAlignClass(col);
        return (
          <TableCell key={index} className={cellClass}>
            <div className={`flex ${flexClass}`}>
              <Skeleton className={`h-4 ${skeletonWidths[index] || 'w-20'}`} />
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default TableSkeletonRow;
