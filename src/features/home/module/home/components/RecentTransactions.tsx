'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';

// Component hiển thị thông tin của 1 giao dịch (Transaction)
export function Transaction({ tx }: { tx: any }) {
  return (
    <div className="border-b last:border-b-0 py-2">
      <div className="flex items-center">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={tx.avatar} alt={tx.user} />
          <AvatarFallback>{tx.user.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* Thông tin giao dịch */}
        <div className="ml-3 flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-semibold truncate">{tx.date}</div>
          <div className="text-xs sm:text-sm truncate">
            <span className="font-semibold">{tx.category}</span>{' '}
            <span className="text-gray-500">from</span>{' '}
            <span className="text-gray-700">{tx.account}</span>
          </div>
          <div className="text-gray-700 text-xs truncate">{tx.recipient}</div>
        </div>

        {/* Mũi tên và số tiền */}
        <div className="flex items-center ml-2">
          <ArrowRight className="text-gray-500 h-4 w-4 flex-shrink-0" />
          <div className="text-right ml-2">
            <div
              className={`text-xs sm:text-sm font-bold ${
                tx.amount < 0 ? 'text-red-500' : 'text-green-500'
              } whitespace-nowrap`}
            >
              {tx.amount.toLocaleString()} USD
            </div>
            <div className="text-xs font-semibold text-gray-600">{tx.type}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  {
    id: 6,
    date: '25-Feb-2025',
    type: 'Expense',
    category: 'Stay & Rest',
    amount: -1000,
    account: 'Bank account A',
    recipient: 'The Eastern Building',
    user: 'Nguyen Van A',
    avatar: 'https://api.slingacademy.com/public/sample-users/5.png',
  },
  {
    id: 7,
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
    <div className="h-[200px] sm:h-[320px] md:h-[440px] lg:h-[600px] overflow-y-auto">
      <div className="font-bold text-lg">Transactions</div>
      {transactions.map((tx) => (
        <Transaction key={tx.id} tx={tx} />
      ))}
    </div>
  );
}
