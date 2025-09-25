import { CommonTable } from '@/components/common/organisms';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { formatDateTime } from '@/shared/lib';
import React, { useCallback, useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/format-currency.util';
import FlexiInterestActionButton from '../atoms/FlexiInterestActionButton';
import FlexiInterestStatusBadge from '../atoms/FlexiInterestStatusBadge';
import FlexiInterestHeaderTopLeft from '../molecules/FlexiInterestHeaderTopLeft';
import FlexiInterestHeaderTopRight from '../molecules/FlexiInterestHeaderTopRight';
import { FlexiInterestCronjobTableData } from '../types/flexi-interest.type';

type ExtraDataTableType = {
  totalItems: number;
  totalSuccess: number;
  totalFailed: number;
};

interface FlexiInterestCronJobTableProps {
  data: FlexiInterestCronjobTableData[];
  loading: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadingMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
  extraData?: ExtraDataTableType;
  onUpdateRowItem?: (id: string, data: Partial<FlexiInterestCronjobTableData>) => void;
  dataFilterOptions: any;
}

const STORAGE_KEY = 'flexi-interest-cronjob:table';

const FlexiInterestCronJobTable: React.FC<FlexiInterestCronJobTableProps> = ({
  data,
  loading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  className,
  extraData,
  onUpdateRowItem,
  dataFilterOptions,
}) => {
  const getRate = useCallback((rate: string | number) => {
    if (typeof rate === 'number') return rate + ' %/year';
    if (rate.includes('%')) return rate.split('%').join(' %');
    return rate + ' %/year';
  }, []);

  const columns: CommonTableColumn<FlexiInterestCronjobTableData>[] = useMemo(
    () => [
      {
        key: 'email',
        title: 'Email',
        align: 'left',
        width: '18%',
        render: (r) => <span className="text-sm">{r.email || '-'}</span>,
      },
      {
        key: 'executionTime',
        title: 'Datetime',
        align: 'left',
        render: (r) => <span className="text-sm">{formatDateTime(r.dateTime)}</span>,
      },
      {
        key: 'tier',
        title: 'Membership Tier',
        align: 'right',
        render: (r) => <span className="text-sm">{r.membershipTier || '-'}</span>,
      },
      {
        key: 'rate',
        title: 'Flexi Interest Rate',
        align: 'right',
        render: (r) => (
          <span className="text-sm">
            {r.flexiInterestRate ? getRate(r.flexiInterestRate as number | string) : '-'}
          </span>
        ),
      },
      {
        key: 'activeBalance',
        title: 'Active Balance',
        align: 'right',
        render: (r) => (
          <span className="text-sm">
            {r.activeBalance ? formatCurrency(r.activeBalance) + ' FX' : '-'}
          </span>
        ),
      },
      {
        key: 'amount',
        title: 'Flexi Interest Amount',
        align: 'right',
        render: (r) => (
          <span className="text-sm">
            {r.flexiInterestAmount
              ? formatCurrency((r.flexiInterestAmount as number) || 0) + ' FX'
              : '-'}
          </span>
        ),
      },
      {
        key: 'status',
        title: 'Status',
        align: 'left',
        render: (r) => <FlexiInterestStatusBadge status={r.status} />,
      },
      {
        key: 'updatedBy',
        title: 'Updated By',
        align: 'left',
        width: '18%',
        render: (r) => <span className="text-sm truncate w-full">{r.updateBy}</span>,
      },
      {
        key: 'reason',
        title: 'Reason',
        align: 'left',
        render: (r) => <span className="text-sm">{r.reason || 'None'}</span>,
      },
      {
        key: 'action',
        title: 'Action',
        align: 'center',
        render: (r) => (
          <FlexiInterestActionButton
            status={r.status}
            id={r.id}
            onUpdateRowItem={onUpdateRowItem}
          />
        ),
      },
    ],
    [],
  );

  const initialConfig: ColumnConfigMap = useMemo(() => {
    return columns.reduce((acc, c, idx) => {
      if (c.key) {
        acc[c.key as string] = {
          isVisible: true,
          index: idx,
          align: c.align,
        };
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
      leftHeaderNode={<FlexiInterestHeaderTopLeft dataFilterOptions={dataFilterOptions} />}
      rightHeaderNode={
        extraData && (
          <FlexiInterestHeaderTopRight
            current={data.length || 0}
            total={extraData.totalItems}
            totalFailed={extraData.totalFailed}
            totalSuccess={extraData.totalSuccess}
          />
        )
      }
    />
  );
};

export default FlexiInterestCronJobTable;
