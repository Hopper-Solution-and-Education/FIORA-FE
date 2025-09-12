import CommonTable from '@/components/common/organisms/CommonTable';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import { useMemo, useState } from 'react';
import MembershipActionButton from '../atoms/MembershipActionButton';
import MembershipStatusBadge from '../atoms/MembershipStatusBadge';
import MembershipTopBarAction from '../molecules/MembershipTopBarAction';
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
  const columns: CommonTableColumn<MembershipCronjobTableData>[] = useMemo(
    () => [
      {
        key: 'email',
        title: 'Email',
        align: 'left',
        render: (r) => <span className="text-sm">{r.email}</span>,
      },
      {
        key: 'datetime',
        title: 'Datetime',
        align: 'left',
        render: (r) => <span className="text-sm">{formatDateTime(r.executionTime)}</span>,
      },
      {
        key: 'fromTier',
        title: 'From Tier',
        align: 'center',
        render: (r) => <span className="text-sm">{r.fromTier}</span>,
      },
      {
        key: 'spent',
        title: 'Spent',
        align: 'right',
        render: (r) => <span className="text-sm">{r.spent} FX</span>,
      },
      {
        key: 'balance',
        title: 'Balance',
        align: 'right',
        render: (r) => <span className="text-sm">{r.balance} FX</span>,
      },
      {
        key: 'toTier',
        title: 'To Tier',
        align: 'center',
        render: (r) => <span className="text-sm">{r.toTier}</span>,
      },
      {
        key: 'status',
        title: 'Status',
        align: 'center',
        render: (r) => <MembershipStatusBadge status={r.status} />,
      },
      {
        key: 'updatedBy',
        title: 'Updated By',
        align: 'left',
        render: (r) => <span className="text-sm">{r.updatedBy.email || 'System'}</span>,
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
      if (c.key) {
        acc[c.key as string] = { isVisible: true, index: idx, align: c.align };
      }
      return acc;
    }, {} as ColumnConfigMap);
  }, [columns]);

  const [columnConfig, setColumnConfig] = useState<ColumnConfigMap>(initialConfig);

  return (
    <CommonTable
      data={data}
      columns={columns}
      columnConfig={columnConfig}
      onColumnConfigChange={setColumnConfig}
      storageKey={STORAGE_KEY}
      loading={loading}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={onLoadMore}
      className={className}
      leftHeaderNode={<MembershipTopBarAction />}
    />
  );
};

export default MembershipCronjobCommonTable;
