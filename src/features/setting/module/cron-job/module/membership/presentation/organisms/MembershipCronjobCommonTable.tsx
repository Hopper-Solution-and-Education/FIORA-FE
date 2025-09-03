import CommonTable from '@/components/common/organisms/CommonTable';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import { useMemo, useState } from 'react';
import { MembershipCronjobTableData } from '../types/membership.type';

interface Props {
  data: MembershipCronjobTableData[];
  loading: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

const STORAGE_KEY = 'membership-cronjob:common-table';

const MembershipCronjobCommonTable = ({
  data,
  loading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  className,
}: Props) => {
  const columns: CommonTableColumn<MembershipCronjobTableData & { index?: number }>[] = useMemo(
    () => [
      {
        key: 'index',
        title: 'No.',
        width: 80,
        align: 'center',
        render: (_r) => null, // will be set via data mapping
      },
      {
        key: 'executionTime',
        title: 'Execution Time',
        align: 'left',
        render: (r) => formatDateTime(r.executionTime),
      },
      { key: 'typeCronJob', title: 'Type', align: 'center' },
      { key: 'status', title: 'Status', align: 'center' },
      { key: 'createdBy', title: 'Created By', align: 'left' },
      { key: 'transactionId', title: 'Transaction Id', align: 'left' },
    ],
    [],
  );

  const initialConfig: ColumnConfigMap = useMemo(() => {
    return columns.reduce((acc, c, idx) => {
      acc[c.key as string] = { isVisible: true, index: idx, align: c.align };
      return acc;
    }, {} as ColumnConfigMap);
  }, [columns]);

  const [columnConfig, setColumnConfig] = useState<ColumnConfigMap>(initialConfig);

  const rowsWithIndex = useMemo(() => data.map((row, idx) => ({ ...row, index: idx + 1 })), [data]);

  const columnsWithIndexRender = useMemo(
    () => columns.map((c) => (c.key === 'index' ? { ...c, render: (r: any) => r.index } : c)),
    [columns],
  );

  return (
    <CommonTable
      data={rowsWithIndex as any}
      columns={columnsWithIndexRender as any}
      columnConfig={columnConfig}
      onColumnConfigChange={setColumnConfig}
      storageKey={STORAGE_KEY}
      loading={loading}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={onLoadMore}
      className={className}
    />
  );
};

export default MembershipCronjobCommonTable;
