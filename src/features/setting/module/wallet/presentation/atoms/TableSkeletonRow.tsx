import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { WALLET_SETTING_TABLE_COLUMN_CONFIG } from '../types/setting.type';

interface TableSkeletonRowProps {
  columns?: string[];
  className?: string;
}

const TableSkeletonRow = ({ columns = [], className }: TableSkeletonRowProps) => {
  const skeletonWidths = ['w-20', 'w-24', 'w-16', 'w-24', 'w-20', 'w-16', 'w-20'];

  const getAlignClass = (col: string) => {
    const side =
      WALLET_SETTING_TABLE_COLUMN_CONFIG[col as keyof typeof WALLET_SETTING_TABLE_COLUMN_CONFIG]
        ?.side || 'center';
    switch (side) {
      case 'left':
        return 'text-left justify-start';
      case 'right':
        return 'text-right justify-end';
      default:
        return 'text-center justify-center';
    }
  };

  return (
    <TableRow className={className}>
      {columns.map((col, index) => {
        const alignClass = getAlignClass(col);
        return (
          <TableCell key={index} className={alignClass.split(' ')[0]}>
            <div className={`flex ${alignClass.split(' ')[1]}`}>
              <Skeleton className={`h-4 ${skeletonWidths[index] || 'w-20'}`} />
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default TableSkeletonRow;
