import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppSelector } from '@/store';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import NotificationDashboardTableRow from '../molecules/NotificationDashboardTableRow';
import TableLoadingState from '../molecules/TableLoadingState';
import {
  NotificationDashboardTableColumnKey,
  NotificationDashboardTableData,
} from '../types/setting.type';
import { getAlignClass } from '../utils/convertTableUtils';

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

  const path = usePathname();
  const isSettingDashboard = !!path?.includes('setting');
  const SETTING_COLUMN = isSettingDashboard ? [] : ['Recipients', 'Sender'];

  const shownColumns = useMemo(
    () =>
      (Object.keys(columnConfig) as NotificationDashboardTableColumnKey[])
        .filter((key) => columnConfig[key].isVisible && !SETTING_COLUMN.includes(key))
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
                const alignClass = getAlignClass(col);
                return (
                  <TableHead key={col} className={`${alignClass} truncate`}>
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
                columns={shownColumns}
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
                  columns={shownColumns}
                />
              </>
            ) : (
              <TableLoadingState
                loading={false}
                isLoadingMore={false}
                dataLength={0}
                hasMore={hasMore}
                columns={shownColumns}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NotificationDashboardTable;
