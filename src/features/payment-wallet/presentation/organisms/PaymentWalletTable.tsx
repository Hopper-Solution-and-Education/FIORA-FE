'use client';

import { Loading } from '@/components/common/atoms';
import { CommonTable } from '@/components/common/tables';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CURRENCY } from '@/shared/constants';
import { formatCurrency } from '@/shared/utils';
import { useMemo } from 'react';
import { usePaymentWalletTransactions } from '../hooks';
import { PaymentWalletSearch } from '../molecules';

const PaymentWalletTable = () => {
  const {
    transactions,
    transactionsLoading,
    transactionsError,
    hasTransactions,
    hasNextPage,
    totalCount,
    loadMoreTransactions,
    refreshTransactions,
  } = usePaymentWalletTransactions();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }: any) => {
          const date = new Date(row.getValue('createdAt'));
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }: any) => {
          const type = row.getValue('type');
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
          return <Badge variant={getTypeVariant(type)}>{type}</Badge>;
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }: any) => {
          const amount = parseFloat(row.getValue('amount'));
          const type = row.original.type;
          const isNegative = type === 'Expense' || type === 'Transfer';

          return (
            <span className={isNegative ? 'text-red-600' : 'text-green-600'}>
              {isNegative ? '-' : '+'}
              {formatCurrency(Math.abs(amount), CURRENCY.FX)}
            </span>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }: any) => {
          const description = row.getValue('description');
          return description || 'No description';
        },
      },
      {
        accessorKey: 'id',
        header: 'Transaction ID',
        cell: ({ row }: any) => {
          const id = row.getValue('id');
          return <span className="font-mono text-xs text-gray-500">{id.slice(0, 8)}...</span>;
        },
      },
    ],
    [],
  );

  if (transactionsLoading && !hasTransactions) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payment Wallet Transactions</h2>
        <div className="flex items-center gap-2">
          <PaymentWalletSearch className="w-64" />
          <Button onClick={refreshTransactions} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {transactionsError && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-600">Error: {transactionsError}</p>
        </div>
      )}

      <div className="border rounded-lg">
        <CommonTable
          data={transactions}
          columns={columns}
          loading={transactionsLoading}
          hasMore={hasNextPage}
          onLoadMore={loadMoreTransactions}
          emptyMessage="No transactions found"
          className="min-h-[400px]"
        />
      </div>

      {hasTransactions && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {transactions.length} of {totalCount} transactions
          </span>
          {hasNextPage && (
            <Button
              onClick={loadMoreTransactions}
              variant="outline"
              size="sm"
              disabled={transactionsLoading}
            >
              {transactionsLoading ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentWalletTable;
