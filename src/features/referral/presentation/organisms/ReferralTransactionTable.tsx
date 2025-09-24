'use client';

import CommonTable from '@/components/common/organisms/CommonTable';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import { useMemo, useState } from 'react';
import type { ReferralTransaction } from '../../types';
import { useReferralTransactionDashboard } from '../hooks/useReferralTransactionDashboard';
import ReferralTransactionTopBarAction from '../molecules/ReferralTransactionTopBarAction';

interface ReferralTransactionTableProps {
  className?: string;
}

interface ReferralTransactionRow extends ReferralTransaction {
  rowNumber: number;
  displayAmount: string;
  formattedDate: string;
}

const STORAGE_KEY = 'referral:transactions-table';
const CURRENCY = 'FX';

const formatAmount = (value: string) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
};

const ReferralTransactionTable = ({ className }: ReferralTransactionTableProps) => {
  const { tableData, loading, loadMore } = useReferralTransactionDashboard();

  const normalizedRows = useMemo<ReferralTransactionRow[]>(
    () =>
      tableData.data.map((item, index) => ({
        ...item,
        displayAmount: `${formatAmount(item.amount)} ${CURRENCY}`,
        formattedDate: item.date ? formatDateTime(item.date) : '',
        rowNumber: index + 1,
      })),
    [tableData.data],
  );

  const columns: CommonTableColumn<ReferralTransactionRow>[] = useMemo(
    () => [
      {
        key: 'rowNumber',
        title: 'No.',
        width: '6%',
        align: 'center',
        render: (row) => (
          <span className="text-xs font-semibold text-muted-foreground">{row.rowNumber}</span>
        ),
      },
      {
        key: 'date',
        title: 'Date',
        width: '20%',
        align: 'left',
        render: (row) => (
          <span className="block text-sm text-foreground">{row.formattedDate || '-'}</span>
        ),
      },
      {
        key: 'type',
        title: 'Type',
        width: '10%',
        align: 'left',
        render: (row) => (
          <Badge
            variant={row.type === 'Income' ? 'default' : 'secondary'}
            className={
              row.type === 'Income'
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-200'
            }
          >
            {row.type}
          </Badge>
        ),
      },
      {
        key: 'amount',
        title: 'Amount',
        width: '14%',
        align: 'left',
        render: (row) => <span className="text-sm">{row.displayAmount}</span>,
      },
      {
        key: 'from',
        title: 'From',
        width: '16%',
        align: 'left',
        render: (row) => (
          <span className="block truncate text-sm text-foreground">
            {row?.from || row?.membershipBenefit?.name || '-'}
          </span>
        ),
      },
      {
        key: 'to',
        title: 'To',
        width: '16%',
        align: 'left',
        render: (row) => (
          <span className="block truncate text-sm text-foreground">{row.to || '-'}</span>
        ),
      },
      {
        key: 'remark',
        title: 'Remark',
        width: '18%',
        align: 'left',
        render: (row) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block truncate text-sm text-foreground cursor-help">
                {row.remark}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-xs whitespace-pre-wrap">
              {row.remark}
            </TooltipContent>
          </Tooltip>
        ),
      },
    ],
    [],
  );

  const initialConfig: ColumnConfigMap = useMemo(() => {
    return columns.reduce((acc, column, index) => {
      if (column.key) {
        acc[column.key as string] = { isVisible: true, index, alignOverride: column.align };
      }
      return acc;
    }, {} as ColumnConfigMap);
  }, [columns]);

  const [columnConfig, setColumnConfig] = useState<ColumnConfigMap>(initialConfig);

  return (
    <div className="space-y-4 border p-4 rounded-2xl">
      <CommonTable
        data={normalizedRows}
        columns={columns}
        columnConfig={columnConfig}
        onColumnConfigChange={setColumnConfig}
        storageKey={STORAGE_KEY}
        loading={loading}
        hasMore={tableData.hasMore}
        isLoadingMore={tableData.isLoadingMore}
        onLoadMore={loadMore}
        className={className}
        leftHeaderNode={<ReferralTransactionTopBarAction />}
      />
    </div>
  );
};

export default ReferralTransactionTable;
