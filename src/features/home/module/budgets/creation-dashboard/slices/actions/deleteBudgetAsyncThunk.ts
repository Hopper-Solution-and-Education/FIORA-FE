import { createAsyncThunk } from '@reduxjs/toolkit';
import { budgetDIContainer } from '../../di/budgetDIContainer';
import { TYPES } from '../../di/budgetDIContainer.type';
import { BudgetDeleteRequest, BudgetDeleteResponse } from '../../domain/entities/Budget';
import { IDeleteBudgetUseCase } from '../../domain/usecases';

export const deleteBudgetAsyncThunk = createAsyncThunk<
  BudgetDeleteResponse,
  BudgetDeleteRequest,
  { rejectValue: string }
>('budgets/delete', async (data, { rejectWithValue }) => {
  try {
    const deleteBudgetUseCase = budgetDIContainer.get<IDeleteBudgetUseCase>(
      TYPES.IDeleteBudgetUseCase,
    );

    const response = await deleteBudgetUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to delete budget');
  }
});
