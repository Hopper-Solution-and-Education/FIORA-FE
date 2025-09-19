import CommonTable from '@/components/common/organisms/CommonTable';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import ReferralActionButton from '@/features/setting/module/cron-job/module/referral/presentation/atoms/ReferralActionButton';
import StatusBadge from '@/features/setting/module/cron-job/module/referral/presentation/atoms/StatusBadge';
import { ReferralCronjobTableData } from '@/features/setting/module/cron-job/module/referral/presentation/types/referral.type';
import { formatReferralDateTime } from '@/shared/lib/formatReferralDateTime';
import { useMemo, useState } from 'react';
import { ReferralTopBarAction } from '..';

interface Props {
  data: ReferralCronjobTableData[];
  loading: boolean;
  className?: string;
  // Infinite scroll props
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  // Summary props
  totalItems: number;
  successfulCount: number;
  failedCount: number;
}

const STORAGE_KEY = 'referral-cronjob:common-table';

const ReferralCronjobCommonTable = ({
  data,
  loading,
  className,
  hasMore,
  isLoadingMore,
  onLoadMore,
  totalItems,
  successfulCount,
  failedCount,
}: Props) => {
  const columns: CommonTableColumn<ReferralCronjobTableData>[] = useMemo(
    () => [
      {
        key: 'id',
        title: 'ID',
        align: 'left',
        width: '8%',
        render: (r) => (
          <span className="text-sm text-blue-600 cursor-pointer hover:underline">
            {r.id.padStart(6, '0')}
          </span>
        ),
      },
      {
        key: 'emailReferrer',
        title: 'Email Referrer',
        align: 'left',
        width: '18%',
        render: (r) => <span className="text-sm truncate block">{r.emailReferrer}</span>,
      },
      {
        key: 'emailReferee',
        title: 'Email Referee',
        align: 'left',
        width: '18%',
        render: (r) => <span className="text-sm truncate block">{r.emailReferee}</span>,
      },
      {
        key: 'datetime',
        title: 'Datetime',
        align: 'left',
        width: '14%',
        render: (r) => (
          <span className="text-sm block">{formatReferralDateTime(r.executionTime)}</span>
        ),
      },
      {
        key: 'typeOfBenefit',
        title: 'Type of Benefit',
        align: 'center',
        width: '12%',
        render: (r) => <span className="text-sm block">{r.typeOfBenefit}</span>,
      },
      {
        key: 'amount',
        title: 'Amount',
        align: 'center',
        width: '9%',
        render: (r) => <span className="text-sm block">{r.amount} FX</span>,
      },
      {
        key: 'status',
        title: 'Status',
        align: 'center',
        width: '12%',
        render: (r) => <StatusBadge status={r.status} />,
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
            <ReferralActionButton
              status={r.status}
              onRetry={(id) => {
                console.log('Retry referral:', id);
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
    <div className="space-y-0">
      {/* Table container with min-height to prevent layout shift */}
      <div className="min-h-[400px] transition-all duration-200">
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
          leftHeaderNode={<ReferralTopBarAction data={data} />}
          rightHeaderNode={
            <div className="border border-border rounded-md px-3 py-2 bg-background">
              <div className="flex flex-col items-end gap-1">
                {/* Show count */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <span className="text-sm font-medium">
                    {data.length.toLocaleString()} / {totalItems.toLocaleString()}
                  </span>
                </div>

                {/* S|F statistics */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-green-600">S</span>
                    <span className="text-sm text-gray-600">|</span>
                    <span className="text-sm font-medium text-red-600">F:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">
                      {successfulCount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">|</span>
                    <span className="text-sm font-medium text-red-600">
                      {failedCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ReferralCronjobCommonTable;
