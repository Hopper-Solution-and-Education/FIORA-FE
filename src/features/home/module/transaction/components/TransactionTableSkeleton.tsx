import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { TransactionTableColumnKey } from '../types';

interface TransactionTableSkeletonProps {
  visibleColumns: TransactionTableColumnKey;
  rows?: number;
}

const TransactionTableSkeleton = ({ visibleColumns, rows = 12 }: TransactionTableSkeletonProps) => {
  // Get the visible columns sorted by index
  const sortedColumns = Object.entries(visibleColumns)
    .filter(([, col]) => col.index >= 0)
    .sort(([, a], [, b]) => a.index - b.index);

  const getSkeletonWidth = (columnKey: string, rowIndex: number) => {
    switch (columnKey) {
      case 'No.':
        return 'w-8';
      case 'Date':
        return 'w-20';
      case 'Type':
        return 'w-16';
      case 'Amount':
        return 'w-24';
      case 'From':
      case 'To':
        return 'w-28';
      case 'Partner':
        return 'w-32';
      case 'Actions':
        return 'w-20';
      default: {
        // Add some variation to skeleton widths to make it look more realistic
        const variations = ['w-16', 'w-20', 'w-24', 'w-28'];
        return variations[rowIndex % variations.length];
      }
    }
  };

  const getSkeletonHeight = (columnKey: string) => {
    switch (columnKey) {
      case 'Actions':
        return 'h-8'; // Taller for action buttons
      default:
        return 'h-4';
    }
  };

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="animate-pulse">
          {sortedColumns.map(([columnKey], colIndex) => (
            <TableCell key={colIndex} className="text-center">
              {columnKey === 'Actions' ? (
                // Special skeleton for action buttons
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ) : (
                <Skeleton
                  className={`${getSkeletonHeight(columnKey)} ${getSkeletonWidth(columnKey, rowIndex)} mx-auto`}
                />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TransactionTableSkeleton;
