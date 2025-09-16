import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { CommonTableColumn } from '../types';

interface Props<T> {
  columns: CommonTableColumn<T>[];
}

export default function CommonTableSkeletonRow<T>({ columns }: Props<T>) {
  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'left') return 'text-left justify-start';
    if (align === 'right') return 'text-right justify-end';
    return 'text-center justify-center';
  };

  const skeletonWidths = ['w-20', 'w-24', 'w-16', 'w-24', 'w-20', 'w-16', 'w-20'];

  return (
    <TableRow>
      {columns.map((col, index) => {
        const alignClass = getAlignClass(col.align);
        const [textAlign, justify] = alignClass.split(' ');
        return (
          <TableCell key={col.key} className={textAlign} style={{ width: col.width }}>
            <div className={`flex ${justify}`}>
              <Skeleton className={`h-4 ${skeletonWidths[index] || 'w-20'}`} />
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
}
