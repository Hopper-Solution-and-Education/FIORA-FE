'use client';

import CommonTable from '@/components/common/organisms/CommonTable';
import { Icons } from '@/components/Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppSelector } from '@/store';
import { useState } from 'react';
import { WalletSearch } from '../molecules';

// Transaction type based on the photo
type TransactionType = 'Expense' | 'Transfer' | 'Income';

// Mock transaction data structure based on the photo
interface WalletTransaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  from: string;
  to: string;
  remark: string;
}

// Mock data based on the photo
const mockTransactions: WalletTransaction[] = [
  {
    id: '1',
    date: '28-Feb-2025',
    type: 'Expense',
    amount: 850,
    from: 'Payment Wallet',
    to: 'Food & Drink',
    remark: 'ABC Restaurant',
  },
  {
    id: '2',
    date: '27-Feb-2025',
    type: 'Transfer',
    amount: 1000,
    from: 'Payment Account',
    to: 'Payment Wallet',
    remark: 'Deposit FX',
  },
  {
    id: '3',
    date: '27-Feb-2025',
    type: 'Income',
    amount: 3,
    from: 'Flexi Interest',
    to: 'Payment Wallet',
    remark: 'Flexi Interest Reward',
  },
  {
    id: '4',
    date: '26-Feb-2025',
    type: 'Transfer',
    amount: 1000,
    from: 'Payment Wallet',
    to: 'Payment Account',
    remark: 'Withdraw FX',
  },
  {
    id: '5',
    date: '25-Feb-2025',
    type: 'Expense',
    amount: 1000,
    from: 'Payment Wallet',
    to: 'Stay & Rest',
    remark: 'The Eastern Buildi...',
  },
];

const WalletDetailsTable = () => {
  const loading = useAppSelector((state) => state.wallet.loading);
  const { formatCurrency } = useCurrencyFormatter();

  const [columnConfig, setColumnConfig] = useState({});

  // Use mock data for now - in real app, this would come from Redux store
  const filteredTransactions = mockTransactions;

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'Income':
        return 'bg-green-100 text-green-700';
      case 'Expense':
        return 'bg-red-100 text-red-700';
      case 'Transfer':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const columns = [
    {
      key: 'no',
      title: 'No.',
      width: '60px',
      align: 'center' as const,
      render: (transaction: WalletTransaction) => {
        const index = mockTransactions.findIndex((t) => t.id === transaction.id);
        return index + 1;
      },
    },
    {
      key: 'date',
      title: 'Date',
      width: '120px',
      align: 'center' as const,
      render: (transaction: WalletTransaction) => (
        <span className="text-sm">{transaction.date}</span>
      ),
    },
    {
      key: 'type',
      title: 'Type',
      width: '100px',
      align: 'center' as const,
      render: (transaction: WalletTransaction) => (
        <Badge className={`${getTypeColor(transaction.type)} font-medium`}>
          {transaction.type}
        </Badge>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      width: '120px',
      align: 'right' as const,
      render: (transaction: WalletTransaction) => (
        <span className="font-semibold">
          {formatCurrency(transaction.amount, CURRENCY.FX, {
            applyExchangeRate: false,
          })}
        </span>
      ),
    },
    {
      key: 'from',
      title: 'From',
      width: '140px',
      align: 'left' as const,
      render: (transaction: WalletTransaction) => (
        <span className="text-sm">{transaction.from}</span>
      ),
    },
    {
      key: 'to',
      title: 'To',
      width: '140px',
      align: 'left' as const,
      render: (transaction: WalletTransaction) => <span className="text-sm">{transaction.to}</span>,
    },
    {
      key: 'remark',
      title: 'Remark',
      width: '160px',
      align: 'left' as const,
      render: (transaction: WalletTransaction) => (
        <span className="text-sm truncate" title={transaction.remark}>
          {transaction.remark}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '80px',
      align: 'center' as const,
      render: (transaction: WalletTransaction) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            // Handle view/edit action
            console.log('View transaction:', transaction.id);
          }}
        >
          <Icons.eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const rightHeaderNode = (
    <div className="flex items-center gap-2">
      <WalletSearch />
      <span className="text-sm text-muted-foreground">
        {filteredTransactions.length}/{mockTransactions.length}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      <CommonTable
        data={filteredTransactions}
        columns={columns}
        columnConfig={columnConfig}
        onColumnConfigChange={setColumnConfig}
        loading={loading}
        rightHeaderNode={rightHeaderNode}
        storageKey="wallet-details-table"
        className="wallet-details-table"
        skeletonRows={5}
      />
    </div>
  );
};

export default WalletDetailsTable;
