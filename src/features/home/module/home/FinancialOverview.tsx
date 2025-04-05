/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FinancialAccount from './FInancialAccount';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Account } from '../../types/FinalcialOverview.types';
import { cn, formatCurrency } from '@/shared/utils';

interface AccountListProps {
  className?: string;
}

export default function AccountList({ className }: AccountListProps) {
  // State for accounts data
  const [parentAccounts, setParentAccounts] = useState<Account[]>([]);
  const [accountsMap, setAccountsMap] = useState<Map<string, Account[]>>(new Map());
  const [totalBalance, setTotalBalance] = useState<string>('0');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);

  const fetchAccountsData = useCallback(async () => {
    try {
      const response = await fetch('/api/accounts/lists');
      const data = await response.json();

      if (data.status !== 200) {
        // alert('Error fetching data');
      }

      const accountsData = data.data as Account[];

      // Filter parent accounts (parentId is null)
      const parents = accountsData.filter((account) => account.parentId === null);

      // Group sub-accounts by parentId
      const subAccountsMap = new Map<string, Account[]>();
      accountsData.forEach((account) => {
        if (account.parentId) {
          if (!subAccountsMap.has(account.parentId)) {
            subAccountsMap.set(account.parentId, []);
          }
          subAccountsMap.get(account.parentId)?.push(account);
        }
      });

      // Group parent accounts by type
      const groupedParents = parents.reduce(
        (acc, account) => {
          const type = account.type;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(account);
          return acc;
        },
        {} as Record<string, Account[]>,
      );

      // Calculate total balance
      const totalBalance = getTotalBalance(parents);
      // Format currency
      const formattedCurrency = formatCurrency(totalBalance);
      setTotalBalance(formattedCurrency);

      // Convert grouped parents to array and sort by type
      const sortedParents = Object.entries(groupedParents)
        .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
        .flatMap(([_, accounts]) => accounts);

      setParentAccounts(sortedParents);
      setAccountsMap(subAccountsMap);
    } catch (err) {
      // alert('Error fetching data');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTriggered, accountsMap, parentAccounts, setIsTriggered, setIsCreateModalOpen]);

  useEffect(() => {
    fetchAccountsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTriggered, setIsTriggered, setIsCreateModalOpen]);

  // only get the total balance of the parent accounts except type as 'CreditCard'
  const getTotalBalance = useCallback(
    (accounts: Account[]) => {
      return accounts.reduce((acc, account) => {
        if (account.type !== 'CreditCard' && account.parentId === null) {
          acc += Number(account.balance);
        }
        return acc;
      }, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTriggered, accountsMap, parentAccounts, setIsTriggered],
  );

  return (
    <div>
      <div className={cn('w-full mb-4 mx-auto border-r rounded p-4', className)}>
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Balance</h3>
              <p className="text-3xl font-bold text-green-600">{totalBalance}</p>
            </div>
            <Button
              variant="default"
              className="flex items-center gap-2"
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-7 h-7" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Accounts List */}
        <div className="pt-4 space-y-1">
          {useMemo(() => {
            return (
              <FinancialAccount
                accountsMap={accountsMap}
                parentAccounts={parentAccounts}
                setAccountsMap={setAccountsMap}
                setTriggered={setIsTriggered}
                isTriggered={isTriggered}
              />
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [accountsMap, parentAccounts])}
        </div>
      </div>
    </div>
  );
}
