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
        width: '18%',
        render: (r) => <span className="text-sm truncate block">{r.email}</span>,
      },
      {
        key: 'datetime',
        title: 'Datetime',
        align: 'left',
        width: '14%',
        render: (r) => <span className="text-sm block">{formatDateTime(r.executionTime)}</span>,
      },
      {
        key: 'fromTier',
        title: 'From Tier',
        align: 'center',
        width: '11%',
        render: (r) => <span className="text-sm block">{r.fromTier}</span>,
      },
      {
        key: 'spent',
        title: 'Spent',
        align: 'right',
        width: '9%',
        render: (r) => <span className="text-sm block">{r.spent} FX</span>,
      },
      {
        key: 'balance',
        title: 'Balance',
        align: 'right',
        width: '9%',
        render: (r) => <span className="text-sm block">{r.balance} FX</span>,
      },
      {
        key: 'toTier',
        title: 'To Tier',
        align: 'center',
        width: '11%',
        render: (r) => <span className="text-sm block">{r.toTier}</span>,
      },
      {
        key: 'status',
        title: 'Status',
        align: 'center',
        width: '12%',
        render: (r) => (
          <div className="flex items-center justify-center">
            <MembershipStatusBadge status={r.status} />
          </div>
        ),
      },
      {
        key: 'updatedBy',
        title: 'Updated By',
        align: 'left',
        width: '18%',
        render: (r) => (
          <span className="text-sm truncate block">{r.updatedBy.email || 'System'}</span>
        ),
      },
      {
        key: 'action',
        title: 'Action',
        align: 'center',
        width: '8%',
        render: (r) => (
          <div className="flex items-center justify-center">
            <MembershipActionButton
              status={r.status}
              toTier={r.toTier}
              onRetry={(id) => {
                console.log('Retry membership:', id);
                // TODO: Implement retry logic
              }}
            />
          </div>
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
