'use client';
import { ButtonCreation } from '@/components/common/atoms';
import { ChartSkeleton, SearchBar } from '@/components/common/organisms';
import StackedBarChart from '@/components/common/stacked-bar-chart';
import { CustomBarItem } from '@/components/common/stacked-bar-chart/type';
import { useAppDispatch, useAppSelector } from '@/store';
import { debounce } from 'lodash';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBudgetAsyncThunk } from '../../slices/actions/getBudgetAsyncThunk';
import { legendItems, mapBudgetToData } from '../../utils';

const BudgetDashboardPage = () => {
  const [inputValue, setInputValue] = useState(''); // For immediate UI updates
  const dispatch = useAppDispatch();
  const [debouncedSearch, setDebouncedSearch] = useState(''); // For API calls
  const currency = useAppSelector((state) => state.settings.currency);
  const { budgets, isLoading, nextCursor } = useAppSelector(
    (state) => state.budgetControl.getBudget,
  );

  const router = useRouter();

  useEffect(() => {
    dispatch(
      getBudgetAsyncThunk({
        cursor: nextCursor,
        search: debouncedSearch,
        take: 3,
      }),
    );
  }, []);

  // Debounced function to update search term for API
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    [],
  );

  const handleSetSearchValue = useCallback(
    (value: string) => {
      setInputValue(value); // Update UI immediately
      debouncedSetSearch(value); // Update debounced search term for API
    },
    [debouncedSetSearch],
  );

  // Handle clear button: reset both states
  const handleClearSearch = useCallback(() => {
    setInputValue('');
    setDebouncedSearch('');
  }, []);

  const handleClickButtonCreation = useCallback(() => {
    router.push('/budgets/create');
  }, []);

  const handleItemClick = useCallback((item: CustomBarItem) => {
    router.push(`/budgets/${item.id}`);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        {/* Search Bar on the Left */}
        <SearchBar
          value={inputValue} // Use inputValue for immediate UI updates
          onChange={handleSetSearchValue}
          placeholder="Search budgets..."
          leftIcon={<Search className="h-5 w-5 text-gray-500" />}
          rightIcon={
            inputValue ? (
              <X className="h-5 w-5 text-gray-500 cursor-pointer" onClick={handleClearSearch} />
            ) : null
          }
          showFilter
          filterContent={
            <div>
              <h3 className="font-semibold mb-2">Filter Budgets</h3>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Active Budgets
              </label>
              <label className="flex items-center mt-2">
                <input type="checkbox" className="mr-2" />
                Archived Budgets
              </label>
            </div>
          }
          className="max-w-md"
          inputClassName="border-gray-300"
          dropdownPosition={{
            side: 'bottom',
          }}
        />

        <ButtonCreation action={handleClickButtonCreation} toolTip="Create New Budget" />
      </div>

      {/* Placeholder for Budget Dashboard Content */}
      <div>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <ChartSkeleton key={index} />)
          : budgets?.map((budgetItem) => {
              const data = mapBudgetToData(budgetItem);
              return (
                <StackedBarChart
                  key={budgetItem.year}
                  data={data}
                  title={`${budgetItem.year}`}
                  currency={currency}
                  locale="en-US"
                  onItemClick={handleItemClick}
                  xAxisFormatter={(value) => `$${value.toLocaleString()}`}
                  tutorialText="Click on a bar to view details."
                  showExpandCollapse={true}
                  maxItems={5}
                  className="my-4"
                  legendItems={legendItems}
                />
              );
            })}
      </div>
    </div>
  );
};

export default BudgetDashboardPage;
