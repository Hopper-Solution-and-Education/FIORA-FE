'use client';

import { Banknote, CreditCard, PiggyBank, TrendingDown, Wallet } from 'lucide-react';
import { useCallback, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Account } from '../../types/FinalcialOverview.types';
import { formatCurrency } from '@/shared/utils';

export default function FinancialAccount({
  accountsMap,
  parentAccounts,
  setAccountsMap,
  setTriggered,
  isTriggered,
}: {
  accountsMap: Map<string, Account[]>;
  parentAccounts: Account[];
  setAccountsMap: (accountsMap: Map<string, Account[]>) => void;
  setTriggered: (value: boolean) => void;
  isTriggered: boolean;
}) {
  // State for accounts data

  // State for the selected account and modal visibility
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for the confirmation dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [subAccountToRemove, setSubAccountToRemove] = useState<{
    parentId: string;
    subAccountId: string;
  } | null>(null);

  // Function to handle account click
  const handleAccountClick = useCallback(
    (account: Account) => {
      // Get sub-accounts for this parent
      const subAccounts = accountsMap.get(account.id) || [];
      // Set the selected account with its sub-accounts
      setSelectedAccount({
        ...account,
        subAccounts,
      });

      setIsModalOpen(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setAccountsMap, accountsMap],
  );

  const handleRemoveAPI = async (parentId: string, subAccountId: string) => {
    try {
      const response = await fetch('/api/accounts/create', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId, subAccountId }),
      });

      const data = await response.json();

      if (data.status !== 201) {
        alert('Error removing sub-account');
      }
      setTriggered(!isTriggered);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Function to handle remove button click
  const handleRemoveClick = (parentId: string, subAccountId: string) => {
    setSubAccountToRemove({ parentId, subAccountId });
    setIsConfirmOpen(true);
  };

  // Function to confirm removal
  const confirmRemove = async () => {
    if (subAccountToRemove) {
      const { parentId, subAccountId } = subAccountToRemove;

      const removedRes = await handleRemoveAPI(parentId, subAccountId);
      if (!removedRes) {
        alert('Error removing sub-account');
        return;
      }
      // Update the accounts map by removing the sub-account
      const updatedSubAccounts =
        accountsMap.get(parentId)?.filter((account) => account.id !== subAccountId) || [];

      const updatedMap = new Map(accountsMap);
      updatedMap.set(parentId, updatedSubAccounts);
      setAccountsMap(updatedMap);

      // Update the selected account if it's currently displayed
      if (selectedAccount && selectedAccount.id === parentId) {
        setSelectedAccount({
          ...selectedAccount,
          subAccounts: selectedAccount.subAccounts?.filter(
            (account) => account.id !== subAccountId,
          ),
        });
      }

      setIsConfirmOpen(false);
      setSubAccountToRemove(null);
    }
  };

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'wallet':
        return <Wallet className="h-5 w-5 text-blue-500" />;
      case 'credit-card':
        return <CreditCard className="h-5 w-5 text-red-500" />;
      case 'piggy-bank':
        return <PiggyBank className="h-5 w-5 text-emerald-500" />;
      case 'banknote':
        return <Banknote className="h-5 w-5 text-amber-500" />;
      case 'trending-down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Wallet className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-2xl font-bold mb-6">My Accounts</h1>
      <div className="space-y-2">
        {parentAccounts.map((account) => (
          <div
            key={account?.id}
            className="flex items-center justify-between p-4 bg-white border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleAccountClick(account)}
          >
            <div className="flex items-center gap-4">
              <div>
                <h5 className="font-medium text-sm text-">{account?.type}</h5>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {getIconComponent(account?.icon)}
              </div>
              <div>
                <h3 className="font-medium">{account?.name}</h3>
              </div>
            </div>
            <div className={`font-semibold ${account?.balance < 0 ? 'text-red-600' : ''}`}>
              {formatCurrency(account?.balance)}
            </div>
          </div>
        ))}
      </div>

      {/* Account Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {selectedAccount && getIconComponent(selectedAccount.icon)}
                <span>{selectedAccount?.name}</span>
              </div>
            </DialogTitle>
            <DialogDescription className="flex justify-between">
              <span
                className={`font-semibold ${selectedAccount && selectedAccount.balance < 0 ? 'text-red-600' : ''}`}
              >
                {selectedAccount ? formatCurrency(selectedAccount.balance) : ''}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">{selectedAccount?.description}</p>

            <h3 className="text-sm font-medium mb-2">Sub-accounts:</h3>
            {!selectedAccount?.subAccounts || selectedAccount.subAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sub-accounts available</p>
            ) : (
              <ul className="space-y-2">
                {selectedAccount.subAccounts.map((subAccount) => (
                  <li
                    key={subAccount.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {getIconComponent(subAccount.icon)}
                      </div>
                      <div>
                        <div className="font-medium">{subAccount.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`${subAccount.balance >= 0 ? '' : 'text-red-600'} font-medium`}
                      >
                        {formatCurrency(subAccount.balance)}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveClick(selectedAccount.id, subAccount.id);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the sub-account.
            </AlertDialogDescription>
            confirmRemove
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
