'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';
import { fetchBudgetYearsAsyncThunk } from '../../slice/action/fetchBudgetYearsAsyncThunk';

export const useInitialBudgetYears = () => {
  const dispatch = useAppDispatch();
  const { budgetYears } = useAppSelector((state) => state.budgetSummary);

  useEffect(() => {
    if (!budgetYears) {
      dispatch(fetchBudgetYearsAsyncThunk());
    }
  }, [budgetYears]);
};
