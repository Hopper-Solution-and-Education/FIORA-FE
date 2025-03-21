'use client';

import { cn } from '@/shared/utils';
import { Pencil } from 'lucide-react';
import { Account, formatCurrency } from './type';

interface NegativeBarProps {
  account: Account;
  widthPercentage: number;
  onDetailClick?: () => void;
  onEditClick?: () => void;
}

export const NegativeBar = ({
  account,
  widthPercentage,
  onDetailClick,
  onEditClick,
}: NegativeBarProps) => {
  return (
    <>
      <div className="flex justify-end items-center w-1/2 pr-2">
        <div className="flex items-center gap-2">
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
          <span className="whitespace-nowrap">
            {formatCurrency(account.balance, account.currency)}
          </span>
        </div>
        <div
          className={cn(
            'h-10 flex items-center justify-end px-3 text-white rounded-sm ml-2 bg-red-500',
            !account.children && 'hover:bg-red-600 transition-colors cursor-pointer',
          )}
          style={{ width: `${widthPercentage}%`, minWidth: '220px' }}
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
          </text>{' '}
          - {account.name}
        </div>
      </div>
      <div className="flex justify-center items-center w-8">
        <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-red-500"></div>
      </div>
      <div className="w-1/2"></div>
    </>
  );
};
