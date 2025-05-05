import { ButtonCreation } from '@/components/common/atoms';
import { SearchBar } from '@/components/common/organisms';
import useDebounce from '@/shared/hooks/useDebounce';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { BudgetDashboardFilter } from '../atoms';
import { BudgetGetFormValues } from '../schema';

const BudgetDashboardHeader = () => {
  const methods = useFormContext<BudgetGetFormValues>();
  const { setValue } = methods;
  const router = useRouter();

  // Handle input change: update ref and call debounced setValue
  const handleInputChange = useDebounce(setValue, 500);

  const handleClickButtonCreation = useCallback(() => {
    router.push('/budgets/create');
  }, []);

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Search Bar on the Left */}
      <SearchBar
        onChange={(e) => handleInputChange('search', e)}
        onClear={() => handleInputChange('search', '')}
        placeholder="Search budgets..."
        leftIcon={<Search className="h-5 w-5 text-gray-500" />}
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
