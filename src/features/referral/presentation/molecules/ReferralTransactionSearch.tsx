'use client';

import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setSearch } from '../../slices';

const SEARCH_DEBOUNCE_DELAY = 400;

const ReferralTransactionSearch = () => {
  const dispatch = useAppDispatch();
  const searchFromRedux = useAppSelector((state) => state.referralTransaction.filter.search || '');

  const [localSearch, setLocalSearch] = useState<string>(searchFromRedux);

  useEffect(() => {
    setLocalSearch(searchFromRedux);
  }, [searchFromRedux]);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        dispatch(setSearch(searchValue));
      }, SEARCH_DEBOUNCE_DELAY),
    [dispatch],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalSearch(newValue);
      debouncedSetSearch(newValue);
    },
    [debouncedSetSearch],
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={localSearch}
        onChange={handleChange}
        placeholder="Search transactions..."
        className="pl-10"
      />
    </div>
  );
};

export default ReferralTransactionSearch;
