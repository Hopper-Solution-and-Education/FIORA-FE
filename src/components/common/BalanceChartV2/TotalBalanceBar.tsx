'use client';

import { Currency, formatCurrency } from './type';

interface TotalBalanceBarProps {
  totalBalance: number;
  currency: Currency;
  widthPercentage: number;
  expanded: boolean;
  onToggle: () => void;
}

export const TotalBalanceBar = ({
  totalBalance,
  currency,
  widthPercentage,
  expanded,
  onToggle,
}: TotalBalanceBarProps) => {
  console.log(expanded);
  return (
    <div className="relative">
      <div className="flex items-center my-2 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-grow items-center min-w-0">
          <div className="w-1/2"></div>
          <div className="flex justify-center items-center w-8">
            <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-green-400"></div>
          </div>
          <div className="flex items-center w-1/2 pl-2">
            <div
              className="h-10 flex items-center px-3 text-white rounded-sm bg-green-600"
              style={{ width: `${widthPercentage}%`, minWidth: '120px' }}
            >
              Total Balance {formatCurrency(totalBalance, currency)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
