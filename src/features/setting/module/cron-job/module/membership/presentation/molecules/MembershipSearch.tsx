import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setSearch } from '../../slices';

const SEARCH_DEBOUNCE_DELAY = 400;

const MembershipSearch = () => {
  const dispatch = useAppDispatch();
  // Get current search value from Redux store
  const searchFromRedux = useAppSelector((state) => state.membershipCronjob.filter.search || '');

  // Local state for immediate UI updates (prevents input lag)
  const [localSearch, setLocalSearch] = useState<string>(searchFromRedux);

  // Sync local search with Redux state changes
  useEffect(() => {
    setLocalSearch(searchFromRedux);
  }, [searchFromRedux]);

  // Create debounced function to delay API calls while user is typing
  // This prevents excessive API requests and improves performance
  const debouncedSetSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        dispatch(setSearch(searchValue));
      }, SEARCH_DEBOUNCE_DELAY),
    [dispatch],
  );

  // Handle input changes with immediate UI update and debounced Redux dispatch
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalSearch(newValue); // Update UI immediately for responsive feel
      debouncedSetSearch(newValue); // Dispatch to Redux after delay (triggers API call)
    },
    [debouncedSetSearch],
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={localSearch}
        onChange={handleChange}
        placeholder="Search email..."
        className="pl-10"
      />
    </div>
  );
};

export default MembershipSearch;
