import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterCriteria } from '@/shared/types/filter.types';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useMemo } from 'react';
import { PaginationParams } from '../types';
import PaymentWalletFilterMenu from './PaymentWalletFilterMenu';

interface SearchFilterHeaderProps {
  displayDataLength: number;
  paginationParams: PaginationParams;
  onRefresh: () => void;
  onSearch: (searchTerm: string) => void;
  onFilterChange: (newFilter: FilterCriteria) => void;
}

const SearchFilterHeader = ({
  displayDataLength,
  paginationParams,
  onRefresh,
  onSearch,
  onFilterChange,
}: SearchFilterHeaderProps) => {
  const debouncedFilterHandler = useMemo(
    () =>
      debounce((value: string) => {
        onSearch(value);
      }, 1000),
    [onSearch],
  );

  return {
    leftHeaderNode: (
      <div className="flex flex-col justify-start items-start gap-4">
        <div className="flex gap-2">
          <div className="relative w-[30vw]">
            <Input
              title="Search"
              placeholder="Search transactions..."
              className="w-full"
              onChange={(e) => debouncedFilterHandler(e.target.value)}
              onBlur={() => debouncedFilterHandler.flush()}
            />
            <Search
              size={15}
              className="absolute top-[50%] right-2 -translate-y-[50%] opacity-50"
            />
          </div>
          <PaymentWalletFilterMenu callBack={onFilterChange} />
        </div>
        <Label className="text-gray-600 dark:text-gray-400">
          Displaying{' '}
          <strong>
            {displayDataLength}/{paginationParams.totalItems}
          </strong>{' '}
          payment wallet transaction records
        </Label>
      </div>
    ),
    rightHeaderNode: (
      <div className="flex gap-2">
        <Button onClick={onRefresh} variant="outline">
          Refresh
        </Button>
      </div>
    ),
  };
};

export default SearchFilterHeader;
