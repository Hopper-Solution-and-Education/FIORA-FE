'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';

// Dữ liệu giao dịch giả lập
const transactions = [
  {
    id: 1,
    date: '28-Feb-2025',
    type: 'Expense',
    category: 'Food & Drink',
    amount: -850,
    account: 'Bank account A',
    recipient: 'ABC Restaurant',
    user: 'Nguyen Van A',
    avatar: 'https://api.slingacademy.com/public/sample-users/1.png',
  },
  {
    id: 2,
    date: '27-Feb-2025',
    type: 'Transfer',
    category: 'Payment',
    amount: 1000,
    account: 'Bank account X',
    recipient: 'Bank account A',
    user: 'Nguyen Van A',
    avatar: 'https://api.slingacademy.com/public/sample-users/2.png',
  },
  {
    id: 3,
    date: '27-Feb-2025',
    type: 'Income',
    category: 'Salary',
    amount: 3000,
    account: 'Apple Inc.',
    recipient: 'Bank account X',
    user: 'Nguyen Van A',
    avatar: 'https://api.slingacademy.com/public/sample-users/3.png',
  },
  {
    id: 4,
    date: '26-Feb-2025',
    type: 'Income',
    category: 'Salary',
    amount: 1000,
    account: 'HopperSE',
    recipient: 'Bank account X',
    user: 'Nguyen Van A',
    avatar: 'https://api.slingacademy.com/public/sample-users/4.png',
  },
  {
    id: 5,
    date: '25-Feb-2025',
    type: 'Expense',
    category: 'Stay & Rest',
    amount: -1000,
    account: 'Bank account A',
    recipient: 'The Eastern Building',
    user: 'Nguyen Van A',
    avatar: 'https://api.slingacademy.com/public/sample-users/5.png',
  },
];

export default function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="border-b pb-3 last:border-b-0">
          <div className="flex items-center">
            {/* Avatar */}
            <Avatar className="h-12 w-12">
              <AvatarImage src={tx.avatar} alt={tx.user} />
              <AvatarFallback>{tx.user.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="ml-4 flex-1">
              <div className="text-sm font-semibold">{tx.date}</div>
              <div className="text-sm">
                <span className="font-semibold">{tx.category}</span>{' '}
                <span className="text-gray-500">from</span>{' '}
                <span className="text-gray-700">{tx.account}</span>
              </div>
              <div className="text-gray-700 text-xs">{tx.recipient}</div>
            </div>

            <ArrowRight className="text-gray-500 mx-2" />

            <div className="text-right">
              <div
                className={`text-sm font-bold ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}
              >
                {tx.amount.toLocaleString()} USD
              </div>
              <div className="text-xs font-semibold text-gray-600">{tx.type}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
