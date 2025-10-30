import CommonTable from '@/components/common/organisms/CommonTable';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import SavingInterestActionButton from '@/features/setting/module/cron-job/module/saving-interest/presentation/atoms/SavingInterestActionButton';
import StatusBadge from '@/features/setting/module/cron-job/module/saving-interest/presentation/atoms/StatusBadge';
import SavingInterestTopBarAction from '@/features/setting/module/cron-job/module/saving-interest/presentation/molecules/SavingInterestTopBarAction';
import { SavingInterestTableData } from '@/features/setting/module/cron-job/module/saving-interest/presentation/types/saving-interest.type';
import { useAppSelector } from '@/store';
import { useMemo, useState } from 'react';

interface Props {
  data: SavingInterestTableData[];
  loading: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
  // Callback for retry action
  onRetrySuccess?: () => void;
}

const STORAGE_KEY = 'saving-interest-cronjob:common-table';

const SavingInterestCommonTable = ({
  data,
  loading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  className,
  onRetrySuccess,
}: Props) => {
  const filterState = useAppSelector((s) => s.savingInterest);

  const columns: CommonTableColumn<SavingInterestTableData>[] = useMemo(
    () => [
      {
        key: 'email',
        title: 'Email',
        align: 'left',
        width: '18%',
        render: (r) => <span className="text-sm text-gray-900 dark:text-gray-100">{r.email}</span>,
      },
      {
        key: 'dateTime',
        title: 'Datetime',
        align: 'left',
        width: '14%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {new Date(r.dateTime).toLocaleDateString('en-GB')},{' '}
            {new Date(r.dateTime).toLocaleTimeString('en-GB', { hour12: false })}
          </span>
        ),
      },
      {
        key: 'membershipTier',
        title: 'Membership Tier',
        align: 'left',
        width: '16%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">{r.membershipTier}</span>
        ),
      },
      {
        key: 'smartSavingRate',
        title: 'Smart Saving Rate',
        align: 'left',
        width: '12%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {r.smartSavingRate}
            {r.smartSavingRate ? '%' : ''}
          </span>
        ),
      },
      {
        key: 'activeBalance',
        title: 'Active Balance',
        align: 'right',
        width: '12%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {r.activeBalance ? `${r.activeBalance} FX` : ''}
          </span>
        ),
      },
      {
        key: 'smartSavingAmount',
        title: 'Smart Saving Amount',
        align: 'right',
        width: '12%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {r.smartSavingAmount ? `${r.smartSavingAmount} FX` : ''}
          </span>
        ),
      },
      {
        key: 'status',
        title: 'Status',
        align: 'center',
        width: '8%',
        render: (r) => <StatusBadge status={r.status} />,
      },
      {
        key: 'updatedBy',
        title: 'Updated By',
        align: 'left',
        width: '12%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">{r.updateBy}</span>
        ),
      },
      {
        key: 'reason',
        title: 'Reason',
        align: 'left',
        width: '10%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">{r.reason || 'None'}</span>
        ),
      },
      {
        key: 'action',
        title: 'Action',
        align: 'center',
        width: '8%',
        render: (r) => (
          <div className="flex items-center justify-center">
            <SavingInterestActionButton
              status={r.status}
              savingInterestId={r.id}
              amount={r.smartSavingAmount?.toString()}
              onRetry={(id, savingInterestAmount, reason) => {
                console.log('Retry saving interest:', { id, savingInterestAmount, reason });
                // Refresh data after successful retry
                if (onRetrySuccess) {
                  onRetrySuccess();
                }
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const columnConfigMap: ColumnConfigMap = useMemo(
    () => ({
      id: { isVisible: true, index: 0, align: 'left' },
      email: { isVisible: true, index: 1, align: 'left' },
      dateTime: { isVisible: true, index: 2, align: 'left' },
      membershipTier: { isVisible: true, index: 3, align: 'left' },
      smartSavingRate: { isVisible: true, index: 4, align: 'left' },
      activeBalance: { isVisible: true, index: 5, align: 'right' },
      smartSavingAmount: { isVisible: true, index: 6, align: 'right' },
      status: { isVisible: true, index: 7, align: 'center' },
      updatedBy: { isVisible: true, index: 8, align: 'left' },
      reason: { isVisible: true, index: 9, align: 'left' },
      action: { isVisible: true, index: 10, align: 'center' },
    }),
    [],
  );

  const [columnConfig, setColumnConfig] = useState<ColumnConfigMap>(columnConfigMap);

  // Calculate statistics from current visible data only
  const actualStatistics = useMemo(() => {
    const actualTotal = data?.length || 0;
    const actualSuccessful =
      data?.filter((item) => item.status === 'SUCCESSFUL' || item.status === 'successful').length ||
      0;
    const actualFailed =
      data?.filter((item) => item.status === 'FAIL' || item.status === 'fail').length || 0;

    return {
      total: actualTotal,
      successful: actualSuccessful,
      failed: actualFailed,
    };
  }, [data]);

  return (
    <div className="space-y-0">
      {/* Table container with min-height to prevent layout shift */}
      <div className="min-h-[400px] transition-all duration-200">
        <CommonTable<SavingInterestTableData>
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
          leftHeaderNode={<SavingInterestTopBarAction data={data} />}
          rightHeaderNode={
            <div className="border border-border rounded-md px-3 py-2 bg-background">
              <div className="flex flex-col items-end gap-1">
                {/* Total count */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-sm font-medium">
                    {actualStatistics.total.toLocaleString()}
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
                      {actualStatistics.successful.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">|</span>
                    <span className="text-sm font-medium text-red-600">
                      {actualStatistics.failed.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
          deps={[filterState]}
        />
      </div>
    </div>
  );
};

export default SavingInterestCommonTable;
