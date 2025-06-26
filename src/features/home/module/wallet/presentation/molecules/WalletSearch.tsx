/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setWalletSearch } from '../../slices';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';

const WalletSearch = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.wallet.filterCriteria.search || '');

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      dispatch(setWalletSearch(value));
    }, 100),
    [dispatch],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearch(e.target.value);
  };

  return (
    <div className="relative min-w-72 lg:min-w-80">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Search" className="pl-9" value={search} onChange={handleChange} />
    </div>
  );
};

export default WalletSearch;
