import TableEmptyState from '../atoms/TableEmptyState';
import TableSkeletonRow from '../atoms/TableSkeletonRow';

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
  skeletonRows = 8,
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
    return <TableEmptyState message="No notifications found" />;
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
        <TableEmptyState message="No more notifications to load" className="py-4 text-sm" />
      )}
    </>
  );
};

export default TableLoadingState;
