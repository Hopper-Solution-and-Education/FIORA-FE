'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Edit,
  MoreHorizontal,
  Trash,
  CreditCard,
  Wallet,
  Landmark,
  PiggyBank,
  DollarSign,
  PoundSterling,
  Bitcoin,
} from 'lucide-react';

interface Account {
  id: string;
  icon: string;
  name: string;
  description: string;
  type: string;
  currency: string;
  limit: number | null;
  balance: number;
}

export default function AccountsTable() {
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const accounts: Account[] = [
    {
      id: 'acc_001',
      icon: 'credit-card',
      name: 'Main Credit Card',
      description: 'Personal expenses credit card',
      type: 'Credit',
      currency: 'USD',
      limit: 5000,
      balance: 1250.75,
    },
    {
      id: 'acc_002',
      icon: 'wallet',
      name: 'Checking Account',
      description: 'Daily transactions account',
      type: 'Checking',
      currency: 'USD',
      limit: null,
      balance: 3450.2,
    },
    {
      id: 'acc_003',
      icon: 'piggy-bank',
      name: 'Savings',
      description: 'Emergency fund savings',
      type: 'Savings',
      currency: 'USD',
      limit: null,
      balance: 12500.0,
    },
    {
      id: 'acc_004',
      icon: 'landmark',
      name: 'Investment Portfolio',
      description: 'Stock market investments',
      type: 'Investment',
      currency: 'USD',
      limit: null,
      balance: 28750.5,
    },
    {
      id: 'acc_005',
      icon: 'credit-card',
      name: 'Business Credit Card',
      description: 'Business expenses only',
      type: 'Credit',
      currency: 'USD',
      limit: 10000,
      balance: 4320.15,
    },
    {
      id: 'acc_006',
      icon: 'wallet',
      name: 'Euro Account',
      description: 'European transactions',
      type: 'Checking',
      currency: 'EUR',
      limit: null,
      balance: 2150.0,
    },
    {
      id: 'acc_007',
      icon: 'piggy-bank',
      name: 'Vacation Fund',
      description: 'Saving for annual vacation',
      type: 'Savings',
      currency: 'USD',
      limit: null,
      balance: 3200.0,
    },
    {
      id: 'acc_008',
      icon: 'bitcoin',
      name: 'Crypto Wallet',
      description: 'Cryptocurrency investments',
      type: 'Investment',
      currency: 'BTC',
      limit: null,
      balance: 0.45,
    },
    {
      id: 'acc_009',
      icon: 'pound-sterling',
      name: 'UK Account',
      description: 'British pound account',
      type: 'Checking',
      currency: 'GBP',
      limit: null,
      balance: 1800.0,
    },
    {
      id: 'acc_010',
      icon: 'credit-card',
      name: 'Rewards Card',
      description: 'Points and cashback card',
      type: 'Credit',
      currency: 'USD',
      limit: 3000,
      balance: 875.25,
    },
    {
      id: 'acc_011',
      icon: 'landmark',
      name: 'Retirement Fund',
      description: 'Long-term retirement savings',
      type: 'Investment',
      currency: 'USD',
      limit: null,
      balance: 87500.0,
    },
    {
      id: 'acc_012',
      icon: 'wallet',
      name: 'Joint Account',
      description: 'Shared household expenses',
      type: 'Checking',
      currency: 'USD',
      limit: null,
      balance: 5430.8,
    },
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = accounts.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedRows.length === currentAccounts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentAccounts.map((account) => account.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Edit account with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log(`Delete account with ID: ${id}`);
    // Implement delete functionality
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'credit-card':
        return <CreditCard className="h-5 w-5 text-gray-600" />;
      case 'wallet':
        return <Wallet className="h-5 w-5 text-gray-600" />;
      case 'landmark':
        return <Landmark className="h-5 w-5 text-gray-600" />;
      case 'piggy-bank':
        return <PiggyBank className="h-5 w-5 text-gray-600" />;
      case 'bitcoin':
        return <Bitcoin className="h-5 w-5 text-gray-600" />;
      case 'pound-sterling':
        return <PoundSterling className="h-5 w-5 text-gray-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'VND':
        return '₫';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'BTC') {
      return `${getCurrencySymbol(currency)}${amount.toFixed(8)}`;
    }
    return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead className="font-medium">NAME</TableHead>
              <TableHead className="font-medium">DESCRIPTION</TableHead>
              <TableHead className="font-medium">TYPE</TableHead>
              <TableHead className="font-medium">CURRENCY</TableHead>
              <TableHead className="font-medium">LIMIT</TableHead>
              <TableHead className="font-medium">BALANCE</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {getIconComponent(account.icon)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell className="text-muted-foreground">{account.description}</TableCell>
                <TableCell>{account.type}</TableCell>
                <TableCell>{account.currency}</TableCell>
                <TableCell>
                  {account.limit !== null ? formatCurrency(account.limit, account.currency) : '—'}
                </TableCell>
                <TableCell className={account.balance < 0 ? 'text-red-500' : ''}>
                  {formatCurrency(account.balance, account.currency)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(account.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(account.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-ce space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
