import { CommonTableColumn } from '@/components/common/organisms/CommonTable/types';
import { Badge } from '@/components/ui/badge';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { useMemo } from 'react';
import { PaymentWalletTransaction } from '../types';
import TableActions from './TableActions';

export const usePaymentWalletTableColumns = (): CommonTableColumn<PaymentWalletTransaction>[] => {
  const { formatCurrency } = useCurrencyFormatter();

  return useMemo(
    () => [
      {
        key: 'no',
        title: 'No.',
        align: 'center',
        width: 60,
        render: (row: PaymentWalletTransaction) => <span>{row.rowNumber || 1}</span>,
      },
      {
        key: 'date',
        title: 'Date',
        align: 'left',
        width: 150,
        render: (row) => {
          const date = new Date(row.createdAt);
          return (
            <span className="underline cursor-pointer">
              {date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          );
        },
      },
      {
        key: 'type',
        title: 'Type',
        align: 'center',
        width: 100,
        render: (row) => {
          const getTypeVariant = (type: string) => {
            switch (type.toLowerCase()) {
              case 'income':
                return 'default';
              case 'expense':
                return 'destructive';
              case 'transfer':
                return 'secondary';
              default:
                return 'outline';
            }
          };
          return (
            <Badge variant={getTypeVariant(row.type)} className="cursor-pointer">
              {row.type}
            </Badge>
          );
        },
      },
      {
        key: 'amount',
        title: 'Amount',
        align: 'right',
        width: 120,
        render: (row) => {
          const amount = parseFloat(row.amount.toString());
          const isNegative = row.type === 'Expense' || row.type === 'Transfer';

          return (
            <span className={cn('font-bold', isNegative ? 'text-red-600' : 'text-green-600')}>
              {isNegative ? '-' : '+'}
              {formatCurrency(Math.abs(amount), row.currency as any)}
            </span>
          );
        },
      },
      {
        key: 'from',
        title: 'From',
        align: 'left',
        width: 120,
        render: (row) => <span className="underline cursor-pointer text-gray-700">{row.from}</span>,
      },
      {
        key: 'to',
        title: 'To',
        align: 'left',
        width: 120,
        render: (row) => <span className="underline cursor-pointer text-gray-700">{row.to}</span>,
      },
      {
        key: 'remark',
        title: 'Remark',
        align: 'left',
        render: (row) => (
          <span className="text-gray-600 max-w-[200px] truncate block">{row.remark}</span>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        align: 'center',
        width: 80,
        render: (row) => <TableActions transaction={row} />,
      },
    ],
    [formatCurrency],
  );
};
