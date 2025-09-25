import { TableCell, TableRow } from '@/components/ui/table';
import { CommonTableColumn } from '../types';
import CommonTableSkeletonRow from './CommonTableSkeletonRow';

interface Props<T> {
  loading: boolean;
  isLoadingMore: boolean;
  dataLength: number;
  hasMore: boolean;
  columns: CommonTableColumn<T>[];
  skeletonRows?: number;
  loadingMoreRows?: number;
}

export default function CommonTableLoadingState<T>({
  loading,
  isLoadingMore,
  dataLength,
  hasMore,
  columns,
  skeletonRows = 8,
  loadingMoreRows = 2,
}: Props<T>) {
  if (loading) {
    return (
      <>
        {Array.from({ length: skeletonRows }).map((_, idx) => (
          <CommonTableSkeletonRow key={`s-${idx}`} columns={columns} />
        ))}
      </>
    );
  }

  if (dataLength === 0) {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
          No data
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {isLoadingMore && (
        <>
          {Array.from({ length: loadingMoreRows }).map((_, idx) => (
            <CommonTableSkeletonRow key={`lm-${idx}`} columns={columns} />
          ))}
        </>
      )}

      {!hasMore && dataLength > 0 && (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="text-center py-4 text-sm text-muted-foreground"
          >
            No more items
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
