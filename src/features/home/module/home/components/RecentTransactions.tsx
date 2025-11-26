'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Avatar } from '@/components/ui/avatar';
import { HttpResponse } from '@/features/setting/module/product/model';
import { useCurrencyFormatter } from '@/shared/hooks';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';
import { TransactionType } from '@prisma/client';
import { ArrowLeftRight, ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';
import { IRelationalTransaction } from '../../transaction/types';
import { formatDate } from '../utils/date';

export function Transaction({ tx }: { tx: IRelationalTransaction }) {
  const { formatCurrency } = useCurrencyFormatter();

  const handlePressTransactionItem = () => {
    redirect(`/transaction/details/${tx.id}`);
  };

  const selectedCurrency = useAppSelector((state) => state.settings.currency);

  const originalAmount = Number(tx.amount);
  const transactionCurrency = tx.currency || 'VND';

  const exchangeRates: Record<string, number> = {
    VND: 1,
    USD: 1 / 25000,
  };

  let displayAmount = originalAmount;
  let displayCurrency = transactionCurrency;

  if (selectedCurrency !== transactionCurrency) {
    if (exchangeRates[transactionCurrency] && exchangeRates[selectedCurrency]) {
      displayAmount =
        (originalAmount * exchangeRates[selectedCurrency]) / exchangeRates[transactionCurrency];
      displayCurrency = selectedCurrency;
    }
  }

  const formattedAmount = formatCurrency(displayAmount, displayCurrency);

  // Get transaction icon and color based on type
  const TransactionIcon =
    tx.type === TransactionType.Income
      ? TrendingUp
      : tx.type === TransactionType.Expense
        ? TrendingDown
        : ArrowLeftRight;

  const iconColorClass =
    tx.type === TransactionType.Expense
      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      : tx.type === TransactionType.Income
        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';

  const glowColorClass =
    tx.type === TransactionType.Expense
      ? 'bg-red-200 dark:bg-red-800/50'
      : tx.type === TransactionType.Income
        ? 'bg-green-200 dark:bg-green-800/50'
        : 'bg-blue-200 dark:bg-blue-800/50';

  const sideIndicatorClass =
    tx.type === TransactionType.Expense
      ? 'bg-gradient-to-b from-red-400 to-red-600'
      : tx.type === TransactionType.Income
        ? 'bg-gradient-to-b from-green-400 to-green-600'
        : 'bg-gradient-to-b from-blue-400 to-blue-600';

  const tooltipContent = (
    <div className="flex flex-col gap-1">
      <span className="font-semibold">{tx.type}</span>
      {tx.partner?.name && (
        <span className="text-xs text-gray-400">Partner: {tx.partner.name}</span>
      )}
      {tx.remark && <span className="text-xs text-gray-400 mt-1 italic">Note: {tx.remark}</span>}
    </div>
  );

  return (
    <div
      onClick={handlePressTransactionItem}
      className="group relative border-b last:border-b-0 py-3 px-2 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent dark:hover:from-gray-800/30 transition-all duration-200 cursor-pointer rounded-lg"
    >
      <CommonTooltip content={tooltipContent}>
        {/* Subtle side indicator */}
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-200 opacity-0 group-hover:opacity-100',
            sideIndicatorClass,
          )}
        />

        <div className="flex items-center gap-3">
          {/* Transaction Type Icon Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                'absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-200',
                glowColorClass,
              )}
            />
            <Avatar
              className={cn(
                'h-12 w-12 border-2 shadow-sm relative z-10 group-hover:scale-105 transition-transform duration-200',
                iconColorClass,
                'border-gray-100 dark:border-gray-700',
              )}
            >
              <div className="flex items-center justify-center h-full w-full">
                <TransactionIcon className="h-6 w-6" />
              </div>
            </Avatar>
          </div>

          {/* Transaction Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {formatDate(tx.date)}
              </div>
            </div>
            <div className="text-sm">
              {tx.type === 'Income' ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-gray-400 dark:text-gray-500">from</span>
                  <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                    {tx.fromCategory?.name ?? 'N/A'}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                    {tx.toAccount?.name ?? 'N/A'}
                  </span>
                </div>
              ) : tx.type === 'Expense' ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-gray-400 dark:text-gray-500">from</span>
                  <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                    {tx.fromAccount?.name ?? 'N/A'}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                    {tx.toCategory?.name ?? 'N/A'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-gray-400 dark:text-gray-500">from</span>
                  <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                    {tx.fromAccount?.name ?? 'N/A'}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                    {tx.toAccount?.name ?? 'N/A'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Amount Display */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div
              className={cn(
                'text-base font-bold whitespace-nowrap transition-all duration-200',
                originalAmount < 0
                  ? 'text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300'
                  : 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300',
              )}
              aria-label={`${formattedAmount}`}
            >
              {formattedAmount}
            </div>
            <ArrowRight className="text-gray-400 dark:text-gray-500 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </CommonTooltip>
    </div>
  );
}

function TransactionSkeleton() {
  return (
    <div className="py-3 px-2 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function RecentTransactions() {
  const { data, isLoading, isValidating } = useDataFetch<HttpResponse<IRelationalTransaction>>({
    endpoint: '/api/transactions',
    method: 'POST',
    body: { page: 1, pageSize: 10, sortBy: { date: 'desc' } },
  });

  const transactions: IRelationalTransaction[] = Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

  if (isLoading || isValidating) {
    return (
      <div className="h-[200px] sm:h-[320px] md:h-[440px] lg:h-[600px] border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="h-7 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
        <div className="overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {[...Array(6)].map((_, idx) => (
            <TransactionSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  const handleClickAllTransactions = () => {
    redirect('/transaction');
  };

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-5 relative overflow-hidden"
      role="region"
      aria-label="Recent Transactions"
      tabIndex={0}
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl -z-10 opacity-50" />

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Transactions
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        <button
          onClick={handleClickAllTransactions}
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-1 group"
        >
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      <div
        className={cn(
          'overflow-y-auto max-h-[calc(100%-3rem)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent',
          transactions?.length > 0 && 'pr-2',
        )}
      >
        {transactions.length > 0 ? (
          transactions.map((tx) => <Transaction key={tx.id} tx={tx} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium">No transactions yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Your transactions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
