import { createAsyncThunk } from '@reduxjs/toolkit';
import { budgetDIContainer } from '../../di/budgetDIContainer';
import { TYPES } from '../../di/budgetDIContainer.type';
import { BudgetCreateRequest, BudgetCreateResponse } from '../../domain/entities/Budget';
import { ICreateBudgetUseCase } from '../../domain/usecases';

export const createBudgetAsyncThunk = createAsyncThunk<
  BudgetCreateResponse,
  BudgetCreateRequest,
  { rejectValue: string }
>('budgets/create', async (data, { rejectWithValue }) => {
  try {
    const createBudgetUseCase = budgetDIContainer.get<ICreateBudgetUseCase>(
      TYPES.ICreateBudgetUseCase,
    );

    const response = await createBudgetUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to create budget');
  }
});
