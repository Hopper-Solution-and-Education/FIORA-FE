'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HttpResponse } from '@/features/setting/module/product/model';
import { useCurrencyFormatter } from '@/shared/hooks';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';
import { TransactionType } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { IRelationalTransaction } from '../../transaction/types';
import { formatDate } from '../utils/date';

export function Transaction({ tx }: { tx: IRelationalTransaction }) {
  // Handle partner logo (URL or icon name)
  const { formatCurrency } = useCurrencyFormatter();

  const handlePressTransactionItem = () => {
    redirect(`/transaction/details/${tx.id}`);
  };

  const isLogoUrl = tx.partner?.logo?.startsWith('http');
  const PartnerIcon =
    !isLogoUrl && tx.partner?.logo ? Icons[tx.partner.logo as keyof typeof Icons] : undefined;

  // Get selected currency from settings
  const selectedCurrency = useAppSelector((state) => state.settings.currency);

  // Original transaction amount and currency
  const originalAmount = Number(tx.amount);
  const transactionCurrency = tx.currency || 'VND'; // Default to VND if undefined

  // Static exchange rates (replace with API in production)
  const exchangeRates: Record<string, number> = {
    VND: 1, // Base currency
    USD: 1 / 25000, // 1 USD = 25,000 VND
  };

  // Convert amount if currencies differ
  let displayAmount = originalAmount;
  let displayCurrency = transactionCurrency;

  if (selectedCurrency !== transactionCurrency) {
    if (exchangeRates[transactionCurrency] && exchangeRates[selectedCurrency]) {
      displayAmount =
        (originalAmount * exchangeRates[selectedCurrency]) / exchangeRates[transactionCurrency];
      displayCurrency = selectedCurrency;
    }
  }

  // Format amount using formatCurrency
  const formattedAmount = formatCurrency(displayAmount, displayCurrency);

  return (
    <div onClick={handlePressTransactionItem} className="border-b last:border-b-0 py-2 text-sm">
      <div className="flex items-center">
        {/* Partner Avatar (logo or icon) */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          {isLogoUrl && tx.partner?.logo ? (
            <CommonTooltip content={<div className="flex flex-col gap-1">{tx.partner.name}</div>}>
              <div className="flex items-center justify-center h-full w-full">
                {tx.partner?.logo ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={tx.partner.logo}
                      alt={tx.partner.name}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                    {tx.partner.name?.slice(0, 2)?.toUpperCase() || 'CN'}
                  </div>
                )}
              </div>
            </CommonTooltip>
          ) : PartnerIcon ? (
            <CommonTooltip content={<div className="flex flex-col gap-1">{tx?.partner?.name}</div>}>
              <div className="flex items-center justify-center h-full w-full">
                <PartnerIcon className="h-5 w-5 text-gray-700" />
              </div>
            </CommonTooltip>
          ) : (
            <AvatarFallback>{tx.partner?.name?.charAt(0).toUpperCase() ?? ''}</AvatarFallback>
          )}
        </Avatar>

        {/* Transaction Info */}
        <div className="ml-3 flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-semibold truncate">{formatDate(tx.date)}</div>
          <div className="text-xs sm:text-sm truncate">
            {tx.type === 'Income' ? (
              <>
                <span className="text-gray-500">From</span>{' '}
                <span className="font-semibold text-gray-700">
                  {tx.fromCategory?.name ?? 'N/A'}
                </span>{' '}
                <span className="text-gray-500">to</span>{' '}
                <span className="text-gray-700">{tx.toAccount?.name ?? 'N/A'}</span>
              </>
            ) : (
              <>
                <span className="text-gray-500">From</span>{' '}
                <span className="font-semibold text-gray-700">{tx.fromAccount?.name ?? 'N/A'}</span>{' '}
                <span className="text-gray-500">to</span>{' '}
                <span className="text-gray-700">{tx.toCategory?.name ?? 'N/A'}</span>
              </>
            )}
          </div>
        </div>

        {/* Arrow + Amount */}
        <div className="flex items-center ml-2">
          <ArrowRight className="text-gray-500 h-4 w-4 flex-shrink-0" />
          <div className="text-right ml-2">
            <div
              className={`text-xs sm:text-sm font-bold ${
                originalAmount < 0 ? 'text-red-500' : 'text-green-500'
              } whitespace-nowrap`}
              aria-label={`${formattedAmount}`}
            >
              {formattedAmount}
            </div>

            <Badge
              className={cn(
                'text-xs font-semibold border-none',
                'hover:bg-inherit hover:text-inherit',
                tx.type === TransactionType.Expense
                  ? 'bg-red-100 text-red-700'
                  : tx.type === TransactionType.Income
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700',
              )}
            >
              {tx.type}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionSkeleton() {
  return (
    <div className="border-b last:border-b-0 py-2 animate-pulse">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="ml-3 flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="ml-2 space-y-2">
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-3 w-8 bg-gray-200 rounded" />
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
      <div className="h-[200px] sm:h-[320px] md:h-[440px] lg:h-[600px] border rounded-md border-gray-100 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-gray-300 ">
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
    <>
      <div
        className="h-[350px] md:h-[400px] lg:h-[500px] border rounded-md border-gray-100 dark:border-gray-800 pl-3 py-2 shadow-sm cursor-pointer relative"
        role="region"
        aria-label="Recent Transactions"
        tabIndex={0}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-lg">Transactions</div>

          <div
            onClick={handleClickAllTransactions}
            className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer mr-4"
          >
            All
          </div>
        </div>
        <div
          className={cn(
            'overflow-y-auto max-h-[calc(100%-2rem)] scrollbar-thin',
            transactions?.length > 0 && 'pr-2',
          )}
        >
          {transactions.length > 0 ? (
            transactions.map((tx) => <Transaction key={tx.id} tx={tx} />)
          ) : (
            <div className="text-gray-500 text-center py-4">No transactions found.</div>
          )}
        </div>
      </div>
    </>
  );
}
