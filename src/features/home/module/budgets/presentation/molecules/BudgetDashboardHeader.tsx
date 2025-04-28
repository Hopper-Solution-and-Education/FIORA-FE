import { ButtonCreation } from '@/components/common/atoms';
import { SearchBar } from '@/components/common/organisms';
import { DebouncedFunc } from 'lodash';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { BudgetDashboardFilter } from '../atoms';

type Props = {
  value: string;
  onChange: (value: string) => void;
  debouncedSearch: DebouncedFunc<(value: string) => void>;
};

const BudgetDashboardHeader = ({ value, onChange, debouncedSearch }: Props) => {
  const router = useRouter();

  const handleSetSearchValue = useCallback(
    (value: string) => {
      onChange(value); // Update UI immediately
      debouncedSearch(value); // Update debounced search term for API
    },
    [debouncedSearch],
  );

  // Handle clear button: reset both states
  const handleClearSearch = useCallback(() => {
    onChange('');
    debouncedSearch('');
  }, []);

  const handleClickButtonCreation = useCallback(() => {
    router.push('/budgets/create');
  }, []);

  const renderRightIcon = useCallback(() => {
    if (value) {
      return <X className="h-5 w-5 text-gray-500 cursor-pointer" onClick={handleClearSearch} />;
    }
    return null;
  }, [value]);

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Search Bar on the Left */}
      <SearchBar
        value={value} // Use inputValue for immediate UI updates
        onChange={handleSetSearchValue}
        placeholder="Search budgets..."
        leftIcon={<Search className="h-5 w-5 text-gray-500" />}
        rightIcon={renderRightIcon()}
        showFilter
        filterContent={<BudgetDashboardFilter />}
        className="max-w-md"
        inputClassName="border-gray-300"
        dropdownPosition={{
          side: 'bottom',
        }}
      />

      <ButtonCreation action={handleClickButtonCreation} toolTip="Create New Budget" />
    </div>
  );
};

export default BudgetDashboardHeader;
