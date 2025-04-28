import { createAsyncThunk } from '@reduxjs/toolkit';
import { BudgetType } from '@prisma/client';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';

export const fetchBudgetByTypeAsyncThunk = createAsyncThunk(
  'budgetSummary/fetchBudgetByType',
  async ({ fiscalYear, type }: { fiscalYear: number; type: BudgetType }) => {
    try {
      const budgetSummaryUseCase = budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(
        TYPES.IBudgetSummaryUseCase,
      );

      const data = await budgetSummaryUseCase.getBudgetByType(fiscalYear, type);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Không thể lấy dữ liệu ngân sách theo loại');
    }
  },
);
