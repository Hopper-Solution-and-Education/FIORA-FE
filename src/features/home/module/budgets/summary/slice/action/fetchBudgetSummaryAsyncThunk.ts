import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchBudgetSummaryStart,
  fetchBudgetSummarySuccess,
  fetchBudgetSummaryFailure,
} from '../budgetSummarySlice';

export const fetchBudgetSummaryAsyncThunk = createAsyncThunk(
  'budgetSummary/fetchBudgetSummary',
  async ({ userId, fiscalYear }: { userId: string; fiscalYear: number }, { dispatch }) => {
    try {
      dispatch(fetchBudgetSummaryStart());

      const response = await fetch(`/api/budgets/summary/${userId}?fiscalYear=${fiscalYear}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể lấy dữ liệu ngân sách');
      }

      const data = await response.json();

      dispatch(
        fetchBudgetSummarySuccess({
          topBudget: data.data.topBudget,
          botBudget: data.data.botBudget,
          actBudget: data.data.actBudget,
          allBudgets: data.data.allBudgets,
        }),
      );

      return data.data;
    } catch (error) {
      dispatch(fetchBudgetSummaryFailure(error instanceof Error ? error.message : 'Đã xảy ra lỗi'));
      throw error;
    }
  },
);
