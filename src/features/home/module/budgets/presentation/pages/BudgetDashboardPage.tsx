'use client';
import { useAppDispatch, useAppSelector } from '@/store';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBudgetAsyncThunk } from '../../slices/actions/getBudgetAsyncThunk';
import { BudgetDashboardHeader } from '../molecules';
import { BudgetDashboard } from '../organisms';

const BudgetDashboardPage = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useAppDispatch();
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { isLoading, budgets } = useAppSelector((state) => state.budgetControl.getBudget);

  useEffect(() => {
    handleGetBudgetData();
  }, []);

  const handleGetBudgetData = useCallback(() => {
    if (isLoading || budgets.length > 0) return;
    dispatch(
      getBudgetAsyncThunk({
        cursor: null,
        search: '',
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

  return (
    <div className="p-6">
      <BudgetDashboardHeader
        value={inputValue}
        onChange={setInputValue}
        debouncedSearch={debouncedSetSearch}
      />

      <BudgetDashboard search={debouncedSearch} />
    </div>
  );
};

export default BudgetDashboardPage;
