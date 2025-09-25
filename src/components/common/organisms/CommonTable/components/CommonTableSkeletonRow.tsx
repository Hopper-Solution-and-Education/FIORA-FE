import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { CommonTableColumn } from '../types';
import { getAlignClass } from '../utils';

interface Props<T> {
  columns: CommonTableColumn<T>[];
}

export default function CommonTableSkeletonRow<T>({ columns }: Props<T>) {
  return (
    <TableRow>
      {columns.map((col) => {
        const alignClass = getAlignClass(col.align);
        const [textAlign, justify] = alignClass.split(' ');

        return (
          <TableCell key={col.key} className={textAlign} style={{ width: col.width }}>
            <div className={`flex ${justify}`}>
              <Skeleton className={`h-4 w-full`} />
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
}
