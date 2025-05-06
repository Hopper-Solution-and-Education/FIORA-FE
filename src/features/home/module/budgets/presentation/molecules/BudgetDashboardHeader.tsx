import { ButtonCreation } from '@/components/common/atoms';
import { SearchBar } from '@/components/common/organisms';
import useDebounce from '@/shared/hooks/useDebounce';
import { useAppDispatch } from '@/store';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { resetGetBudgetState } from '../../slices';
import { getBudgetAsyncThunk } from '../../slices/actions/getBudgetAsyncThunk';
import { BudgetDashboardFilter } from '../atoms';
import { BudgetGetFormValues } from '../schema';
import { isNumber } from 'lodash';

const BudgetDashboardHeader = () => {
  const methods = useFormContext<BudgetGetFormValues>();
  const { setValue, watch, setError } = methods;
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Handle input change: update ref and call debounced setValue

  const search = watch('search');

  const handleSearch = useCallback(
    (e: string) => {
      if (!isNumber(e)) {
        setError('search', {
          message: 'Search must be a number',
          type: 'validate',
        });
        return;
      }
      setValue('search', e);
      dispatch(resetGetBudgetState());
      dispatch(
        getBudgetAsyncThunk({
          cursor: null,
          search: e,
          take: 3,
        }),
      );
    },
    [dispatch, setError, setValue],
  );

  const handleInputChange = useDebounce(handleSearch, 500);

  const handleClickButtonCreation = useCallback(() => {
    router.push('/budgets/create');
  }, []);

  // Default right icon: show X icon if ref has value and no custom rightIcon
  const renderRightIcon = search ? (
    <X className="h-5 w-5 text-gray-500 cursor-pointer" onClick={() => setValue('search', '')} />
  ) : null;

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Search Bar on the Left */}
      <SearchBar
        onChange={handleInputChange}
        placeholder="Search budgets..."
        leftIcon={<Search className="h-5 w-5 text-gray-500" />}
        rightIcon={renderRightIcon}
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
