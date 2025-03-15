'use client';

import { Pencil } from 'lucide-react';
import { Account, formatCurrency } from './type';
import { cn } from '@/shared/utils';

interface PositiveBarProps {
  account: Account;
  widthPercentage: number;
  isTotalBalance: boolean;
  onDetailClick?: () => void;
  onEditClick?: () => void;
}

export const PositiveBar = ({
  account,
  widthPercentage,
  isTotalBalance,
  onDetailClick,
  onEditClick,
}: PositiveBarProps) => {
  const bgColor = isTotalBalance ? 'bg-green-400' : 'bg-green-600';

  return (
    <>
      <div className="w-1/2"></div>
      <div className="flex justify-center items-center w-8">
        <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-green-500"></div>
      </div>
      <div className="flex items-center w-1/2 pl-2">
        {isTotalBalance ? (
          <div
            className={cn('h-10 flex items-center px-3 text-white rounded-sm', bgColor)}
            style={{ width: `${widthPercentage}%`, minWidth: '120px' }}
          >
            {account.name} {formatCurrency(account.balance, account.currency)}
          </div>
        ) : (
          <>
            <div
              className={cn(
                'h-10 flex items-center px-3 text-white rounded-sm cursor-pointer gap-2',
                bgColor,
                !account.children && 'hover:bg-green-600 transition-colors',
              )}
              style={{ width: `${widthPercentage}%`, minWidth: '120px' }}
              onClick={() => !account.children && onDetailClick?.()}
            >
              <text
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {account.type}
              </text>
              {account.name}
            </div>

            <div className="ml-2 whitespace-nowrap flex items-center gap-2">
              <span>{formatCurrency(account.balance, account.currency)}</span>
              {!account.children && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick?.();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
