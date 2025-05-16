import { createAsyncThunk } from '@reduxjs/toolkit';
import { budgetDIContainer } from '../../di/budgetDIContainer';
import { TYPES } from '../../di/budgetDIContainer.type';
import { BudgetGetRequest, BudgetGetResponse } from '../../domain/entities/Budget';
import { IGetBudgetUseCase } from '../../domain/usecases/getBudgetUseCase';

export const getBudgetAsyncThunk = createAsyncThunk<
  BudgetGetResponse,
  BudgetGetRequest,
  { rejectValue: string }
>('budgets/get', async (data, { rejectWithValue }) => {
  try {
    const getBudgetUseCase = budgetDIContainer.get<IGetBudgetUseCase>(TYPES.IGetBudgetUseCase);
    const response = await getBudgetUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to get budget');
  }
});
