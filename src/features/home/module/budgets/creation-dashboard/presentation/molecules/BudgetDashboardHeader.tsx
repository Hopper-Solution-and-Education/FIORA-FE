import { ButtonCreation } from '@/components/common/atoms';
import { SearchBar } from '@/components/common/organisms';
import useDebounce from '@/shared/hooks/useDebounce';
import { useAppDispatch } from '@/store';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { resetGetBudgetState } from '../../slices';
import { getBudgetAsyncThunk } from '../../slices/actions/getBudgetAsyncThunk';
import { BudgetDashboardFilter } from '../atoms';
import { BudgetGetFormValues } from '../schema';

const BudgetDashboardHeader = () => {
  const methods = useFormContext<BudgetGetFormValues>();
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isShowDropdownFilter, setIsShowDropdownFilter] = useState(false);

  const handleSearch = useCallback((inputString: string) => {
    // Trim whitespace from the input string
    const trimmedInput = inputString.trim();

    // If input is empty, clear any errors and search with empty string
    if (trimmedInput === '') {
      clearErrors('search'); // Clear previous errors for 'search' field
      setValue('search', ''); // Set form value to empty string
      dispatch(resetGetBudgetState());
      dispatch(
        getBudgetAsyncThunk({
          cursor: null,
          search: '', // Search with empty string (effectively no year filter)
          take: 3,
        }),
      );
      return; // Stop processing
    }

    // Attempt to parse the trimmed input as an integer
    const yearNumber = parseInt(trimmedInput, 10); // Use radix 10

    // --- Validation Logic for a Year ---
    const isValidYear =
      !isNaN(yearNumber) && // Check if parsing resulted in a valid number
      Number.isInteger(yearNumber) && // Check if it's an integer
      String(yearNumber) === trimmedInput; // Strict check: original string matches parsed number string (handles "01", "2024a" etc.)
    // --- End Validation Logic ---

    if (isValidYear) {
      // Input is a valid year
      clearErrors('search'); // Clear any previous year validation errors
      setValue('search', String(yearNumber)); // Set the form value as a number
      dispatch(resetGetBudgetState());
      dispatch(
        getBudgetAsyncThunk({
          cursor: null,
          search: trimmedInput,
          take: 3,
        }),
      );
    } else {
      // Input is NOT a valid year
      setError('search', {
        message: 'Please enter a valid fiscal year ',
        type: 'manual',
      });
    }
  }, []);

  const handleInputChange = useDebounce(handleSearch, 500);

  const handleClickButtonCreation = useCallback(() => {
    router.push('/budgets/create');
  }, []);

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Search Bar on the Left */}
      <SearchBar
        onChange={handleInputChange}
        placeholder="Search budgets..."
        leftIcon={<Search className="h-5 w-5 text-gray-500" />}
        showFilterButton
        filterContent={
          <BudgetDashboardFilter onFilterDropdownOpenChange={setIsShowDropdownFilter} />
        }
        className="max-w-md"
        type="number"
        inputClassName="border-gray-300"
        dropdownPosition={{
          side: 'bottom',
        }}
        isFilterDropdownOpen={isShowDropdownFilter}
        onFilterDropdownOpenChange={setIsShowDropdownFilter}
        error={errors['search']?.message}
      />

      <ButtonCreation action={handleClickButtonCreation} toolTip="Create New Budget" />
    </div>
  );
};

export default BudgetDashboardHeader;
