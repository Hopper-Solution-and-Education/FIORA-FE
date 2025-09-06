import CommonTable from '@/components/common/organisms/CommonTable';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { useMemo, useState } from 'react';
import { MembershipActionButton, MembershipIdCell, MembershipStatusBadge } from '../atoms';
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
        key: 'id',
        title: 'ID',
        align: 'left',
        render: (r) => <MembershipIdCell id={r.id} executionTime={r.executionTime} />,
      },
      {
        key: 'email',
        title: 'Email',
        align: 'left',
        render: (r) => <span className="text-sm font-medium">{r.email}</span>,
      },
      {
        key: 'executionTime',
        title: 'Datetime',
        align: 'left',
        render: (r) => <span className="text-sm text-muted-foreground">{r.executionTime}</span>,
      },
      {
        key: 'fromTier',
        title: 'From Tier',
        align: 'center',
        render: (r) => <span className="text-sm font-medium">{r.fromTier}</span>,
      },
      {
        key: 'spent',
        title: 'Spent',
        align: 'right',
        render: (r) => <span className="text-sm font-mono">{r.spent} FX</span>,
      },
      {
        key: 'balance',
        title: 'Balance',
        align: 'right',
        render: (r) => <span className="text-sm font-mono">{r.balance} FX</span>,
      },
      {
        key: 'toTier',
        title: 'To Tier',
        align: 'center',
        render: (r) => <span className="text-sm font-medium">{r.toTier}</span>,
      },
      {
        key: 'status',
        title: 'Status',
        align: 'center',
        render: (r) => <MembershipStatusBadge status={r.status} />,
      },
      {
        key: 'action',
        title: 'Action',
        align: 'center',
        render: (r) => (
          <MembershipActionButton
            status={r.status}
            toTier={r.toTier}
            onRetry={(id) => {
              console.log('Retry membership:', id);
              // TODO: Implement retry logic
            }}
          />
        ),
      },
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
