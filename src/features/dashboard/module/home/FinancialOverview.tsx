'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  SendHorizontal,
  QrCode,
  Plus,
  ArrowRight,
  CreditCard,
} from 'lucide-react';

interface AccountItem {
  id: string;
  title: string;
  description?: string;
  balance: string;
  type: 'savings' | 'checking' | 'investment' | 'debt';
}

interface List01Props {
  totalBalance?: string;
  accounts?: AccountItem[];
  className?: string;
}

const ACCOUNTS: AccountItem[] = [
  {
    id: '1',
    title: 'Main Savings',
    description: 'Personal savings',
    balance: '$8,459.45',
    type: 'savings',
  },
  {
    id: '2',
    title: 'Checking Account',
    description: 'Daily expenses',
    balance: '$2,850.00',
    type: 'checking',
  },
  {
    id: '3',
    title: 'Investment Portfolio',
    description: 'Stock & ETFs',
    balance: '$15,230.80',
    type: 'investment',
  },
  {
    id: '4',
    title: 'Credit Card',
    description: 'Pending charges',
    balance: '$1,200.00',
    type: 'debt',
  },
  {
    id: '5',
    title: 'Savings Account',
    description: 'Emergency fund',
    balance: '$3,000.00',
    type: 'savings',
  },
];

export default function List01({
  totalBalance = '$26,540.25',
  accounts = ACCOUNTS,
  className,
}: List01Props) {
  return (
    <Card className={cn('w-full mb-4 mx-auto', className)}>
      {/* Total Balance Section */}
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold">Total Balance</CardTitle>
        <p className="text-3xl font-bold text-green-600">{totalBalance}</p>
      </CardHeader>

      {/* Accounts List */}
      <CardContent className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Accounts</h2>
        <div className="space-y-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn('p-2 rounded-lg', {
                    'bg-emerald-100 dark:bg-emerald-900/30': account.type === 'savings',
                    'bg-blue-100 dark:bg-blue-900/30': account.type === 'checking',
                    'bg-purple-100 dark:bg-purple-900/30': account.type === 'investment',
                    'bg-red-100 dark:bg-red-900/30': account.type === 'debt',
                  })}
                >
                  {account.type === 'savings' && <Wallet className="w-5 h-5 text-emerald-600" />}
                  {account.type === 'checking' && <QrCode className="w-5 h-5 text-blue-600" />}
                  {account.type === 'investment' && (
                    <ArrowUpRight className="w-5 h-5 text-purple-600" />
                  )}
                  {account.type === 'debt' && <CreditCard className="w-5 h-5 text-red-600" />}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{account.title}</h3>
                  {account.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {account.description}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold">{account.balance}</span>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Footer with action buttons */}
      <div className="p-4 border-t flex gap-2">
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <SendHorizontal className="w-4 h-4" />
          Send
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowDownLeft className="w-4 h-4" />
          Top-up
        </Button>
        <Button variant="ghost" className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          More
        </Button>
      </div>
    </Card>
  );
}
