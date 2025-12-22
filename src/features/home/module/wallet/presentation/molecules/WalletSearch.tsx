'use client';

import DebounceSearchInput from '@/components/common/atoms/DebounceSearchInput';
import { useAppDispatch, useAppSelector } from '@/store';
import { setDepositSearch, setWalletSearch } from '../../slices';

interface WalletSearchProps {
  searchType?: 'normal' | 'deposit';
  loading?: boolean;
  placeholder?: string;
  debounce?: number;
  isLoading?: boolean;
}

const WalletSearch = ({
  searchType = 'normal',
  loading,
  debounce = 100,
  placeholder = 'Search',
}: WalletSearchProps) => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) =>
    searchType === 'deposit'
      ? state.wallet.depositSearch || ''
      : state.wallet.filterCriteria.search || '',
  );

  const handleChange = (value: string) => {
    if (searchType === 'deposit') {
      dispatch(setDepositSearch(value));
    } else {
      dispatch(setWalletSearch(value));
    }
  };

  return (
    <div className="relative min-w-72 lg:min-w-80">
      <DebounceSearchInput
        value={search}
        onChange={handleChange}
        placeholder={placeholder}
        debounceMs={debounce}
        isLoading={loading}
      />
    </div>
  );
};

export default WalletSearch;
