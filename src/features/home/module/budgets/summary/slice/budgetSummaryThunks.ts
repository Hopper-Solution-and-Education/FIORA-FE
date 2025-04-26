import { createAsyncThunk } from '@reduxjs/toolkit';
import { BudgetType } from '@prisma/client';
import {
  fetchBudgetSummaryStart,
  fetchBudgetSummarySuccess,
  fetchBudgetSummaryFailure,
} from './budgetSummarySlice';

// Thunk để lấy tất cả budgets theo userId và fiscalYear
export const fetchBudgetSummary = createAsyncThunk(
  'budgetSummary/fetchBudgetSummary',
  async ({ userId, fiscalYear }: { userId: string; fiscalYear: number }, { dispatch }) => {
    try {
      dispatch(fetchBudgetSummaryStart());

      // Gọi API để lấy dữ liệu
      const response = await fetch(`/api/budgets/summary/${userId}?fiscalYear=${fiscalYear}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể lấy dữ liệu ngân sách');
      }

      const data = await response.json();

      // Dispatch action thành công với dữ liệu nhận được
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
      // Dispatch action thất bại với thông báo lỗi
      dispatch(fetchBudgetSummaryFailure(error instanceof Error ? error.message : 'Đã xảy ra lỗi'));
      throw error;
    }
  },
);

// Thunk để lấy budget theo loại
export const fetchBudgetByType = createAsyncThunk(
  'budgetSummary/fetchBudgetByType',
  async ({
    userId,
    fiscalYear,
    type,
  }: {
    userId: string;
    fiscalYear: number;
    type: BudgetType;
  }) => {
    const response = await fetch(
      `/api/budgets/summary/${userId}?fiscalYear=${fiscalYear}&type=${type}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể lấy dữ liệu ngân sách theo loại');
    }

    const data = await response.json();
    return data.data;
  },
);
