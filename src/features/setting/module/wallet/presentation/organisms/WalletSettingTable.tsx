import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppSelector } from '@/store';
import { useMemo } from 'react';
import { useInfiniteScroll } from '../hooks';
import { TableLoadingState, WalletSettingTableRow } from '../molecules';
import { WalletSettingTableData } from '../types';
import {
  WALLET_SETTING_TABLE_COLUMN_CONFIG,
  WalletSettingTableColumnKey,
} from '../types/setting.type';

interface WalletSettingTableProps {
  data: WalletSettingTableData[];
  loading: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

const WalletSettingTable = ({
  data,
  loading,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  className,
}: WalletSettingTableProps) => {
  const containerRef = useInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore,
    isLoadingMore,
  });

  const columnConfig = useAppSelector((state) => state.walletSetting.columnConfig);

  const shownColumns = useMemo(
    () =>
      (Object.keys(columnConfig) as WalletSettingTableColumnKey[])
        .filter((key) => columnConfig[key].isVisible)
        .sort((a, b) => columnConfig[a].index - columnConfig[b].index),
    [columnConfig],
  );

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div ref={containerRef} className="rounded-md border max-h-[600px] overflow-y-auto relative">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {shownColumns.map((col: WalletSettingTableColumnKey) => {
                const side = WALLET_SETTING_TABLE_COLUMN_CONFIG[col]?.side || 'center';
                let alignClass = 'text-center';

                if (side === 'left') alignClass = 'text-left';
                else if (side === 'right') alignClass = 'text-right';

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
                {data.map((item) => (
                  <WalletSettingTableRow key={item.id} data={item} columns={shownColumns} />
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

export default WalletSettingTable;
