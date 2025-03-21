'use client';

import { NegativeBar } from './NegativeBar';
import { PositiveBar } from './PositiveBar';
import { Account, calculateBarWidth, findParentBalance, isPositiveType } from './type';

interface BalanceBarProps {
  account: Account;
  allAccounts: Account[];
  totalPositiveBalance: number;
  totalNegativeBalance: number;
  level?: number;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  onDetailClick: (account: Account) => void;
  onEditClick: (account: Account) => void;
  isTotalBalance?: boolean;
  parentWidth?: number;
}

export const BalanceBar = ({
  account,
  allAccounts,
  totalPositiveBalance,
  totalNegativeBalance,
  level = 0,
  expanded,
  onToggle,
  onDetailClick,
  onEditClick,
  isTotalBalance = false,
  parentWidth,
}: BalanceBarProps) => {
  const isPositive = isPositiveType(account.type);

  // Calculate width percentage based on parent's balance or total balance
  const referenceBalance = account.parentId
    ? findParentBalance(allAccounts, account.parentId)
    : isPositive
      ? totalPositiveBalance
      : totalNegativeBalance;

  // Calculate this bar's width, considering parent's width constraint
  const widthPercentage = calculateBarWidth(account, referenceBalance, parentWidth);

  // Determine if this account has children
  const hasChildren = account.children && account.children.length > 0;

  // Determine if this account is expanded
  const isExpanded = expanded[account.id];

  return (
    <div className="relative">
      <div className="flex items-center my-2" onClick={() => hasChildren && onToggle(account.id)}>
        {/* Spacer for indentation based on level */}
        {level > 0 && (
          <div
            className="flex-shrink-0"
            style={{
              width: `${level * 20}px`,
            }}
          ></div>
        )}

        {/* Bar container with proper alignment */}
        <div className="flex flex-grow items-center min-w-0">
          {isPositive ? (
            <PositiveBar
              account={account}
              widthPercentage={widthPercentage}
              isTotalBalance={isTotalBalance}
              onDetailClick={() => onDetailClick(account)}
              onEditClick={() => onEditClick(account)}
            />
          ) : (
            <NegativeBar
              account={account}
              widthPercentage={widthPercentage}
              onDetailClick={() => onDetailClick(account)}
              onEditClick={() => onEditClick(account)}
            />
          )}
        </div>
      </div>

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <div>
          {account.children?.map((child) => (
            <BalanceBar
              key={child.id}
              account={child}
              allAccounts={allAccounts}
              totalPositiveBalance={totalPositiveBalance}
              totalNegativeBalance={totalNegativeBalance}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onDetailClick={onDetailClick}
              onEditClick={onEditClick}
              parentWidth={widthPercentage} // Pass current width as constraint for children
            />
          ))}
        </div>
      )}
    </div>
  );
};
