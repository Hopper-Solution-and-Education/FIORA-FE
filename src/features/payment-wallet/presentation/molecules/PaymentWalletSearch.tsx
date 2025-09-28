'use client';

import { Input } from '@/components/ui/input';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useCallback } from 'react';
import { usePaymentWalletTransactions } from '../hooks';

interface PaymentWalletSearchProps {
  placeholder?: string;
  className?: string;
}

const PaymentWalletSearch = ({
  placeholder = 'Search transactions...',
  className = 'relative min-w-72 lg:min-w-80',
}: PaymentWalletSearchProps) => {
  const { searchTerm, searchTransactions } = usePaymentWalletTransactions();

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      searchTransactions(value);
    }, 300),
    [searchTransactions],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className={className}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-9"
        defaultValue={searchTerm || ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default PaymentWalletSearch;
