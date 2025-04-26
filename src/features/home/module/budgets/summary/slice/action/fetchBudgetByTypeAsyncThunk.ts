import { createAsyncThunk } from '@reduxjs/toolkit';
import { BudgetType } from '@prisma/client';

export const fetchBudgetByTypeAsyncThunk = createAsyncThunk(
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
