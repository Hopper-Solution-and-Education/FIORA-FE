import { CommonTableColumn } from '@/components/common/organisms/CommonTable/types';
import { TRANSACTION_TYPE as TRANSACTION_TYPE_COLOR_MAP } from '@/features/home/module/transaction/utils/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { useCallback, useMemo } from 'react';
import { usePaymentWalletTransactions } from '../../../hooks';
import { PaymentWalletTransaction } from '../types';
import TableActions from './TableActions';

// Helper to build (or extend) filter criteria immutably
const addTypeFilter = (filters: any, type: string) => {
  const nextFilters = { ...(filters || {}) };
  const andArr: any[] = Array.isArray(nextFilters.AND) ? [...nextFilters.AND] : [];

  // Check if an OR group with this type already exists
  const hasType = andArr.some((cond) =>
    cond?.OR?.some((inner: any) => typeof inner === 'object' && inner.type === type),
  );
  if (!hasType) {
    andArr.push({ OR: [{ type }] });
  }
  nextFilters.AND = andArr;
  return nextFilters;
};

const setExactDateFilter = (filters: any, isoDate: string) => {
  const dateObj = new Date(isoDate);
  const start = new Date(dateObj);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateObj);
  end.setHours(23, 59, 59, 999);

  return {
    ...(filters || {}),
    date: { gte: start.toISOString(), lte: end.toISOString() },
  };
};

export const usePaymentWalletTableColumns = (): CommonTableColumn<PaymentWalletTransaction>[] => {
  const { formatCurrency } = useCurrencyFormatter();
  const { filterCriteria, filterTransactions } = usePaymentWalletTransactions();

  const handleApplyFilters = useCallback(
    (updater: (prevFilters: any) => any) => {
      const newFilters = updater(filterCriteria.filters);
      filterTransactions({ ...filterCriteria, filters: newFilters });
    },
    [filterCriteria, filterTransactions],
  );

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
        align: 'center',
        width: 150,
        render: (row) => {
          const date = new Date(row.createdAt);
          const formatted = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          const colorClass = TRANSACTION_TYPE_COLOR_MAP[row.type.toUpperCase()] || 'gray-600';
          return (
            <span
              className={cn('underline cursor-pointer', `text-${colorClass}`)}
              onClick={() => handleApplyFilters((prev) => setExactDateFilter(prev, row.createdAt))}
            >
              {formatted}
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
          const colorClass = TRANSACTION_TYPE_COLOR_MAP[row.type.toUpperCase()] || 'gray-600';
          return (
            <span
              className={cn('underline cursor-pointer font-bold', `text-${colorClass}`)}
              onClick={() => handleApplyFilters((prev) => addTypeFilter(prev, row.type))}
            >
              {row.type}
            </span>
          );
        },
      },
      {
        key: 'amount',
        title: 'Amount',
        align: 'center',
        width: 120,
        render: (row) => {
          const amount = parseFloat(row.amount.toString());
          const colorClass = TRANSACTION_TYPE_COLOR_MAP[row.type.toUpperCase()] || 'gray-600';

          return (
            <span className={cn('underline cursor-pointer font-bold', `text-${colorClass}`)}>
              {formatCurrency(Math.abs(amount), row.currency as any)}
            </span>
          );
        },
      },
      {
        key: 'from',
        title: 'From',
        align: 'center',
        width: 120,
        render: (row) => {
          const colorClass = TRANSACTION_TYPE_COLOR_MAP[row.type.toUpperCase()] || 'gray-600';

          return (
            <span
              className={cn(
                row.from ? `underline cursor-pointer text-${colorClass}` : 'text-gray-600',
              )}
              onClick={() => {
                if (row.from) return;
                // Treat wallet filter similar to filter menu (single wallet selection)
                handleApplyFilters((prev) => {
                  const next = { ...(prev || {}) };
                  const andArr: any[] = Array.isArray(next.AND) ? [...next.AND] : [];
                  const walletGroup = {
                    OR: [
                      {
                        OR: [{ toWallet: { id: row.fromId } }, { fromWallet: { id: row.fromId } }],
                      },
                    ],
                  };
                  const exists = andArr.some((c) =>
                    c?.OR?.some((inner: any) =>
                      inner?.OR?.some(
                        (w: any) =>
                          w?.toWallet?.id === row.fromId || w?.fromWallet?.id === row.fromId,
                      ),
                    ),
                  );
                  if (!exists) andArr.push(walletGroup);
                  next.AND = andArr;
                  return next;
                });
              }}
            >
              {row.from ?? 'Unknown'}
            </span>
          );
        },
      },
      {
        key: 'to',
        title: 'To',
        align: 'center',
        width: 120,
        render: (row) => {
          const colorClass = TRANSACTION_TYPE_COLOR_MAP[row.type.toUpperCase()] || 'gray-600';
          return (
            <span
              className={cn(
                row.to ? `underline cursor-pointer text-${colorClass}` : 'text-gray-600',
              )}
              onClick={() => {
                if (row.to) return;
                handleApplyFilters((prev) => {
                  const next = { ...(prev || {}) };
                  const andArr: any[] = Array.isArray(next.AND) ? [...next.AND] : [];
                  const walletGroup = {
                    OR: [{ toWallet: { id: row.toId } }, { fromWallet: { id: row.toId } }],
                  };
                  const exists = andArr.some((c) =>
                    c?.OR?.some((inner: any) =>
                      inner?.OR?.some(
                        (w: any) => w?.toWallet?.id === row.toId || w?.fromWallet?.id === row.toId,
                      ),
                    ),
                  );
                  if (!exists) andArr.push(walletGroup);
                  next.AND = andArr;
                  return next;
                });
              }}
            >
              {row.to ?? 'Unknown'}
            </span>
          );
        },
      },
      {
        key: 'remark',
        title: 'Remark',
        align: 'center',
        width: 240,
        render: (row) => {
          const colorClass = TRANSACTION_TYPE_COLOR_MAP[row.type.toUpperCase()] || 'gray-600';
          return (
            <span className={cn('max-w-[200px] truncate block', `text-${colorClass}`)}>
              {row.remark}
            </span>
          );
        },
      },
      {
        key: 'actions',
        title: 'Actions',
        align: 'center',
        width: 80,
        render: (row) => <TableActions transaction={row} />,
      },
    ],
    [formatCurrency, handleApplyFilters],
  );
};
