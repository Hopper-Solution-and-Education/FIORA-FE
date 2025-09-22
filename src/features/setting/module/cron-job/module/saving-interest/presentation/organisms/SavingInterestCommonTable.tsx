import CommonTable from '@/components/common/organisms/CommonTable';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import SavingInterestActionButton from '@/features/setting/module/cron-job/module/saving-interest/presentation/atoms/SavingInterestActionButton';
import StatusBadge from '@/features/setting/module/cron-job/module/saving-interest/presentation/atoms/StatusBadge';
import SavingInterestTopBarAction from '@/features/setting/module/cron-job/module/saving-interest/presentation/molecules/SavingInterestTopBarAction';
import { SavingInterestTableData } from '@/features/setting/module/cron-job/module/saving-interest/presentation/types/saving-interest.type';
import { useMemo, useState } from 'react';

interface Props {
  data: SavingInterestTableData[];
  loading: boolean;
  className?: string;
  // Callback for retry action
  onRetrySuccess?: () => void;
}

const STORAGE_KEY = 'saving-interest-cronjob:common-table';

const SavingInterestCommonTable = ({ data, loading, className, onRetrySuccess }: Props) => {
  const columns: CommonTableColumn<SavingInterestTableData>[] = useMemo(
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
        key: 'email',
        title: 'Email',
        align: 'left',
        width: '15%',
        render: (r) => <span className="text-sm text-gray-900 dark:text-gray-100">{r.email}</span>,
      },
      {
        key: 'executionTime',
        title: 'Datetime',
        align: 'left',
        width: '12%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {new Date(r.executionTime).toLocaleDateString('en-GB')},{' '}
            {new Date(r.executionTime).toLocaleTimeString('en-GB', { hour12: false })}
          </span>
        ),
      },
      {
        key: 'membershipTier',
        title: 'Membership Tier',
        align: 'left',
        width: '15%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">{r.membershipTier}</span>
        ),
      },
      {
        key: 'savingInterestRate',
        title: 'Saving Interest Rate',
        align: 'left',
        width: '12%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">{r.savingInterestRate}</span>
        ),
      },
      {
        key: 'activeBalance',
        title: 'Active Balance',
        align: 'right',
        width: '12%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">{r.activeBalance}</span>
        ),
      },
      {
        key: 'savingInterestAmount',
        title: 'Saving Interest Amount',
        align: 'right',
        width: '12%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">{r.savingInterestAmount}</span>
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
        width: '10%',
        render: (r) => (
          <span className="text-sm text-gray-900 dark:text-gray-100">{r.updatedBy.email}</span>
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
      executionTime: { isVisible: true, index: 2, align: 'left' },
      membershipTier: { isVisible: true, index: 3, align: 'left' },
      savingInterestRate: { isVisible: true, index: 4, align: 'left' },
      activeBalance: { isVisible: true, index: 5, align: 'right' },
      savingInterestAmount: { isVisible: true, index: 6, align: 'right' },
      status: { isVisible: true, index: 7, align: 'center' },
      updatedBy: { isVisible: true, index: 8, align: 'left' },
      reason: { isVisible: true, index: 9, align: 'left' },
      action: { isVisible: true, index: 10, align: 'center' },
    }),
    [],
  );

  const [columnConfig, setColumnConfig] = useState<ColumnConfigMap>(columnConfigMap);

  // Calculate statistics from actual data
  const actualStatistics = useMemo(() => {
    const actualTotal = data?.length || 0;
    const actualSuccessful = data?.filter((item) => item.status === 'successful').length || 0;
    const actualFailed = data?.filter((item) => item.status === 'fail').length || 0;

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
        />
      </div>
    </div>
  );
};

export default SavingInterestCommonTable;
