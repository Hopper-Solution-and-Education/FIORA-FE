import { TableEmptyState, TableSkeletonRow } from '../atoms';

interface TableLoadingStateProps {
  loading: boolean;
  isLoadingMore: boolean;
  dataLength: number;
  hasMore: boolean;
  skeletonRows?: number;
  loadingMoreRows?: number;
}

const TableLoadingState = ({
  loading,
  isLoadingMore,
  dataLength,
  hasMore,
  skeletonRows = 5,
  loadingMoreRows = 3,
}: TableLoadingStateProps) => {
  if (loading) {
    return (
      <>
        {Array.from({ length: skeletonRows }).map((_, index) => (
          <TableSkeletonRow key={`skeleton-${index}`} />
        ))}
      </>
    );
  }

  if (dataLength === 0) {
    return <TableEmptyState message="No requests found" />;
  }

  return (
    <>
      {isLoadingMore && (
        <>
          {Array.from({ length: loadingMoreRows }).map((_, index) => (
            <TableSkeletonRow key={`loading-more-${index}`} />
          ))}
        </>
      )}
      {!hasMore && dataLength > 0 && (
        <TableEmptyState message="No more requests to load" className="py-4 text-sm" />
      )}
    </>
  );
};

export default TableLoadingState;
