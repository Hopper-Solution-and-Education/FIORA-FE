'use client';

import { useEffect, useState } from 'react';
import { AccountDetailDialog } from './AccountDetailDialog';
import { BalanceBar } from './BalanceBar';
import { EditAccountDialog } from './EditAccountDialog';
import { TotalBalanceBar } from './TotalBalanceBar';
import {
  Account,
  ApiAccount,
  calculateTotalBalance,
  Currency,
  flattenAccounts,
  isPositiveType,
  parseApiData,
} from './type';

export const BalanceChart = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    total: true, // Total Balance is expanded by default
  });

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setLoading] = useState(true);

  // get all accounts
  const fetchAllAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounts/lists');

      const data = await response.json();

      if (data.status !== 200) {
        console.error('Error fetching accounts:', data.message);
        return;
      }
      const accounts = data.data as ApiAccount[];

      // Parse the API data
      const parsedAccounts = parseApiData(accounts);
      // Calculate total balance
      const totalBalance = calculateTotalBalance(parsedAccounts);

      setTotalBalance(totalBalance);
      setAccounts(parsedAccounts);
      return data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAccounts();
  }, []);

  // Flatten accounts for easier lookup
  const allAccounts = flattenAccounts(accounts);

  // Calculate total positive and negative balances
  let totalPositiveBalance = 0;
  let totalNegativeBalance = 0;

  accounts.forEach((account) => {
    const balance =
      typeof account.balance === 'string' ? Number.parseFloat(account.balance) : account.balance;

    if (isPositiveType(account.type)) {
      totalPositiveBalance += Math.abs(balance);
    } else {
      totalNegativeBalance += Math.abs(balance);
    }
  });

  // Toggle expanded state for an account
  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle showing account details
  const handleDetailClick = (account: Account) => {
    setSelectedAccount(account);
    setIsDetailOpen(true);
  };

  // Handle showing edit dialog
  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setIsEditOpen(true);
  };

  // Handle closing the dialogs
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedAccount(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedAccount(null);
  };

  // Handle form submission
  const handleSubmit = (account: Account) => {
    console.log('Submitting account:', account);
    handleCloseEdit();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Balance Chart</h2>
        <div className="border rounded-lg p-6 bg-white flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="rounded-lg p-2 bg-white">
        {/* Total Balance Bar */}
        <TotalBalanceBar
          totalBalance={totalBalance}
          currency={Currency.VND}
          widthPercentage={95}
          expanded={expanded['total']}
          onToggle={() => toggleExpanded('total')}
        />
        {/* Account Bars */}
        {expanded['total'] &&
          accounts.map((account) => (
            <BalanceBar
              key={account.id}
              account={account}
              allAccounts={allAccounts}
              totalPositiveBalance={totalPositiveBalance}
              totalNegativeBalance={totalNegativeBalance}
              expanded={expanded}
              onToggle={toggleExpanded}
              onDetailClick={handleDetailClick}
              onEditClick={handleEditClick}
            />
          ))}
      </div>

      {/* Account Detail Dialog */}
      <AccountDetailDialog
        account={selectedAccount}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />

      {/* Edit Account Dialog */}
      <EditAccountDialog
        account={selectedAccount}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BalanceChart;
