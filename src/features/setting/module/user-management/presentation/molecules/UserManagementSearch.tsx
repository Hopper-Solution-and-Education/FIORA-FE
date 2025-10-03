import { Input } from '@/components/ui/input';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const SEARCH_DEBOUNCE_DELAY = 300;

interface UserManagementSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const UserManagementSearch = ({ value, onChange }: UserManagementSearchProps) => {
  const [localSearch, setLocalSearch] = useState<string>(value);

  useEffect(() => {
    setLocalSearch(value);
  }, [value]);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        onChange(searchValue);
      }, SEARCH_DEBOUNCE_DELAY),
    [onChange],
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
        placeholder="Search users..."
        className="pl-10"
      />
    </div>
  );
};

export default UserManagementSearch;