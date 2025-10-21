'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import CommonTable from '@/components/common/organisms/CommonTable';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

// Helper function để lấy màu sắc dựa trên loại transaction
const getTransactionTextColor = (type: string) => {
  switch (type) {
    case 'Income':
      return 'text-green-600 dark:text-green-400';
    case 'Transfer':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-foreground';
  }
};

// Reusable component để render text với màu phù hợp
const TransactionText = ({
  children,
  type,
  className = '',
  variant = 'normal',
}: {
  children: React.ReactNode;
  type: string;
  className?: string;
  variant?: 'normal' | 'bold' | 'muted';
}) => {
  const baseClasses = getTransactionTextColor(type);

  const variantClasses = {
    normal: '',
    bold: 'font-bold',
    muted: 'text-muted-foreground',
  };

  const combinedClassName =
    `block truncate ${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return <span className={combinedClassName}>{children}</span>;
};

const formatAmount = (value: string) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
};

const ReferralTransactionTable = ({ className }: ReferralTransactionTableProps) => {
  const router = useRouter();
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

  const gotoDetailPage = (id: string) => {
    router.push(`/transaction/details/${id}`);
  };

  const columns: CommonTableColumn<ReferralTransactionRow>[] = useMemo(
    () => [
      {
        key: 'rowNumber',
        title: 'No.',
        width: '6%',
        align: 'center',
        render: (row) => (
          <span className={`text-xs font-semibold ${getTransactionTextColor(row.type)}`}>
            {row.rowNumber}
          </span>
        ),
      },
      {
        key: 'date',
        title: 'Date',
        width: '20%',
        align: 'left',
        render: (row) => (
          <CommonTooltip content={row.formattedDate || '-'} side="top" align="start">
            <TransactionText type={row.type}>{row.formattedDate || '-'}</TransactionText>
          </CommonTooltip>
        ),
      },
      {
        key: 'type',
        title: 'Type',
        width: '10%',
        align: 'left',
        render: (row) => (
          <TransactionText type={row.type} variant="bold">
            {row.type}
          </TransactionText>
        ),
      },
      {
        key: 'amount',
        title: 'Amount',
        width: '14%',
        align: 'left',
        render: (row) => (
          <TransactionText type={row.type} variant="bold">
            {row.displayAmount}
          </TransactionText>
        ),
      },
      {
        key: 'from',
        title: 'From',
        width: '16%',
        align: 'left',
        render: (row) => (
          <TransactionText type={row.type}>
            {row?.from || row?.membershipBenefit?.name || '-'}
          </TransactionText>
        ),
      },
      {
        key: 'to',
        title: 'To',
        width: '16%',
        align: 'left',
        render: (row) => <TransactionText type={row.type}>{row.to || '-'}</TransactionText>,
      },
      {
        key: 'remark',
        title: 'Remark',
        width: '18%',
        align: 'left',
        render: (row) => (
          <CommonTooltip content={row.remark} side="top" align="start">
            <span className={`block truncate ${getTransactionTextColor(row.type)}`}>
              {row.remark}
            </span>
          </CommonTooltip>
        ),
      },
      {
        key: 'action',
        title: 'Action',
        width: '10%',
        align: 'center',
        render: (row) => (
          <CommonTooltip content="Details">
            <Button variant="ghost" size="icon" onClick={() => gotoDetailPage(row.id)}>
              <FileText size={18} color="#595959" />
            </Button>
          </CommonTooltip>
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
