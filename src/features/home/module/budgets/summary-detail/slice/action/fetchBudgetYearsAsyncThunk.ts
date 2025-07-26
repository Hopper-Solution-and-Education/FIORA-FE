import { createAsyncThunk } from '@reduxjs/toolkit';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';

export const fetchBudgetYearsAsyncThunk = createAsyncThunk(
  'budgetSummary/fetchBudgetYears',
  async () => {
    try {
      const budgetSummaryUseCase = budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(
        TYPES.IBudgetSummaryUseCase,
      );

      const data = await budgetSummaryUseCase.getBudgetYears();
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch budget years');
    }
  },
);
