import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppSelector } from '@/store';
import { useMemo } from 'react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import NotificationDashboardTableRow from '../molecules/NotificationDashboardTableRow';
import TableLoadingState from '../molecules/TableLoadingState';
import {
  NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG,
  NotificationDashboardTableColumnKey,
  NotificationDashboardTableData,
} from '../types/setting.type';

interface NotificationDashboardTableProps {
  data: NotificationDashboardTableData[];
  loading: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

const NotificationDashboardTable = ({
  data,
  loading,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  className,
}: NotificationDashboardTableProps) => {
  const columnConfig = useAppSelector((state) => state.notificationDashboard.columnConfig);
  const shownColumns = useMemo(
    () =>
      (Object.keys(columnConfig) as NotificationDashboardTableColumnKey[])
        .filter((key) => columnConfig[key].isVisible)
        .sort((a, b) => columnConfig[a].index - columnConfig[b].index),
    [columnConfig],
  );

  const containerRef = useInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore,
    isLoadingMore,
  });

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div ref={containerRef} className="rounded-md border max-h-[600px] overflow-y-auto relative">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {shownColumns.map((col) => {
                const side = NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG[col]?.side || 'center';
                let alignClass = 'text-center';
                if (side === 'left') alignClass = 'text-left';
                else if (side === 'right') alignClass = 'text-right';
                return (
                  <TableHead key={col} className={alignClass}>
                    {col}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableLoadingState
                loading={true}
                isLoadingMore={false}
                dataLength={0}
                hasMore={true}
              />
            ) : data.length > 0 ? (
              <>
                {data.map((item, idx) => (
                  <NotificationDashboardTableRow
                    key={item.id}
                    data={item}
                    columns={shownColumns}
                    index={idx}
                  />
                ))}
                <TableLoadingState
                  loading={false}
                  isLoadingMore={isLoadingMore}
                  dataLength={data.length}
                  hasMore={hasMore}
                />
              </>
            ) : (
              <TableLoadingState
                loading={false}
                isLoadingMore={false}
                dataLength={0}
                hasMore={hasMore}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NotificationDashboardTable;
