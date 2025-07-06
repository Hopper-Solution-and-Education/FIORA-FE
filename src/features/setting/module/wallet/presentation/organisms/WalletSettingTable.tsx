import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { WalletSettingTableRow, TableLoadingState } from '../molecules';
import { WalletSettingTableData } from '../types';
import { useInfiniteScroll } from '../hooks';
import { WalletSettingTableColumnKey } from '../types/setting.type';
import { DepositRequestStatus } from '../../domain/enum';

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

  const columnConfig = useSelector((state: RootState) => state.walletSetting.columnConfig);

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
              {shownColumns.map((col: WalletSettingTableColumnKey) => (
                <TableHead key={col} className="text-center">
                  {col}
                </TableHead>
              ))}
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
                {data.map((item) => (
                  <WalletSettingTableRow key={item.id} data={item} columns={shownColumns} />
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

export default WalletSettingTable;
