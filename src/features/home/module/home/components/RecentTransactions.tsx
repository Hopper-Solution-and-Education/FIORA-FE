'use client';

import { Icons } from '@/components/Icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useDataFetcher from '@/hooks/useDataFetcher';
import { ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import {
  CurrentTransaction,
  ICurrentTransactionPaginatedResponse,
} from '../types/RecentTransactionResponse';
import { formatDate } from '../utils/date';
import NavigateDialog from './NavigateDialog';

export function Transaction({ tx }: { tx: CurrentTransaction }) {
  // Lấy icon từ tx.fromAccount.icon, nếu không tồn tại => undefined
  const IconComponent = tx.fromAccount?.icon
    ? Icons[tx.fromAccount.icon as keyof typeof Icons]
    : undefined;
  // Chuyển đổi amount sang number để sử dụng toLocaleString()
  const amount = Number(tx.amount);

  return (
    <div className="border-b last:border-b-0 py-2">
      <div className="flex items-center">
        {/* Avatar (vòng tròn) chứa icon hoặc fallback */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          {IconComponent ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center h-full w-full">
                    <IconComponent className="h-5 w-5 text-gray-700" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <div className="flex flex-col gap-1">From Account: {tx.fromAccount?.name}</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <AvatarFallback>{tx.fromAccount?.name?.charAt(0).toUpperCase() ?? ''}</AvatarFallback>
          )}
        </Avatar>

        {/* Thông tin giao dịch */}
        <div className="ml-3 flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-semibold truncate">{formatDate(tx.date)}</div>
          <div className="text-xs sm:text-sm truncate">
            <span className="font-semibold">{tx?.toCategory?.name ?? ''}</span>{' '}
            <span className="text-gray-500">from</span>{' '}
            <span className="text-gray-700">{tx.toAccount ? tx.toAccount.name : 'N/A'}</span>
          </div>
          <div className="text-gray-700 text-xs truncate">
            {tx.toAccount ? `Limit: ${tx.toAccount.limit}` : 'No account limit'}
          </div>
        </div>

        {/* Mũi tên + số tiền */}
        <div className="flex items-center ml-2">
          <ArrowRight className="text-gray-500 h-4 w-4 flex-shrink-0" />
          <div className="text-right ml-2">
            <div
              className={`text-xs sm:text-sm font-bold ${
                amount < 0 ? 'text-red-500' : 'text-green-500'
              } whitespace-nowrap`}
            >
              {amount.toLocaleString()} {tx.currency}
            </div>
            <div className="text-xs font-semibold text-gray-600">{tx.type}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Skeleton để hiển thị trong lúc loading
function TransactionSkeleton() {
  return (
    <div className="border-b last:border-b-0 py-2 animate-pulse">
      <div className="flex items-center">
        {/* Skeleton Avatar */}
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        {/* Skeleton Content */}
        <div className="ml-3 flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        {/* Skeleton for Amount */}
        <div className="ml-2 space-y-2">
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-3 w-8 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function RecentTransactions() {
  const { data, isLoading, isValidating } = useDataFetcher<ICurrentTransactionPaginatedResponse>({
    endpoint: '/api/transactions',
    method: 'POST',
    body: { page: 1, pageSize: 10, sortBy: { date: 'desc' } },
  });

  const [isShowDialog, setIsShowDialog] = useState(false);

  const onConfirm = () => {
    redirect('/transaction');
  };

  const transactions = data?.data.data ?? [];

  // Khi đang loading, hiển thị skeleton view
  if (isLoading || isValidating) {
    return (
      <div className="h-[200px] sm:h-[320px] md:h-[440px] lg:h-[600px] border rounded-md border-gray-100 p-4 overflow-hidden shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        {/* Hiển thị 3 skeleton transactions */}
        {[...Array(3)].map((_, idx) => (
          <TransactionSkeleton key={idx} />
        ))}
      </div>
    );
  }

  const handleClickRecentTransactionPage = () => {
    setIsShowDialog(true);
  };

  return (
    <>
      <div
        onClick={handleClickRecentTransactionPage}
        className="h-[200px] sm:h-[320px] md:h-[440px] lg:h-[600px] border rounded-md border-gray-100 p-4 overflow-hidden shadow-sm cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg mb-2">Transactions</div>
          <div className="text-sm text-gray-500">Click to view details</div>
        </div>

        {transactions.length > 0 ? (
          transactions.map((tx) => <Transaction key={tx.id} tx={tx} />)
        ) : (
          <div className="text-gray-500">No transactions found.</div>
        )}
      </div>
      <NavigateDialog
        isOpen={isShowDialog}
        onClose={() => setIsShowDialog(false)}
        onConfirm={onConfirm}
      />
    </>
  );
}
