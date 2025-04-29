import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchBudgetSummaryStart,
  fetchBudgetSummarySuccess,
  fetchBudgetSummaryFailure,
} from '../budgetSummarySlice';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';

export const fetchBudgetSummaryAsyncThunk = createAsyncThunk(
  'budgetSummary/fetchBudgetSummary',
  async ({ userId, fiscalYear }: { userId: string; fiscalYear: number }, { dispatch }) => {
    try {
      dispatch(fetchBudgetSummaryStart());

      const budgetSummaryUseCase = budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(
        TYPES.IBudgetSummaryUseCase,
      );

      const data = await budgetSummaryUseCase.getBudgetsByUserIdAndFiscalYear(userId, fiscalYear);

      dispatch(
        fetchBudgetSummarySuccess({
          topBudget: data.topBudget,
          botBudget: data.botBudget,
          actBudget: data.actBudget,
          allBudgets: data.allBudgets,
        }),
      );

      return data;
    } catch (error) {
      dispatch(fetchBudgetSummaryFailure(error instanceof Error ? error.message : 'Fail to fetch'));
      throw error;
    }
  },
);
