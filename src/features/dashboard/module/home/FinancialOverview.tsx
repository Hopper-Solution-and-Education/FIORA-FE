'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import FinancialAccount from './FInancialAccount';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Account } from '../../types/FinalcialOverview.types';
import { formatCurrency } from '@/lib/formatCurrency';
import { CreateAccountModal } from '@/features/setting/presentation/module/account/components/CreateAccountPage';

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
        alert('Error fetching data');
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
      // format currency
      const formattedCurrency = formatCurrency(totalBalance);
      setTotalBalance(formattedCurrency);

      // Convert grouped parents to array and sort by type
      const sortedParents = Object.entries(groupedParents)
        .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
        .flatMap(([_, accounts]) => accounts);

      setParentAccounts(sortedParents);
      setAccountsMap(subAccountsMap);
    } catch (err) {
      alert('Error fetching data');
    }
  }, [isTriggered, accountsMap, parentAccounts, setIsTriggered, setIsCreateModalOpen]);

  useEffect(() => {
    // Sample data from the provided JSON
    fetchAccountsData();
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
    [isTriggered, accountsMap, parentAccounts, setIsTriggered],
  );

  return (
    <div>
      <Card className={cn('w-full mb-4 mx-auto', className)}>
        {/* Total Balance Section */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Total Balance</CardTitle>
              <p className="text-3xl font-bold text-green-600">{totalBalance}</p>
            </div>
            <Button
              variant="default"
              className="flex items-center gap-2"
              size={'lg'}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-7 h-7" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        {/* Accounts List */}
        <CardContent className="space-y-1">
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
          }, [accountsMap, parentAccounts])}
        </CardContent>
      </Card>
      <div>
        <CreateAccountModal
          isOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          setTriggered={setIsTriggered}
          isTriggered={isTriggered}
        />
      </div>
    </div>
  );
}
