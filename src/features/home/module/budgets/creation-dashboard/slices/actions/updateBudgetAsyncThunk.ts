import { setErrorsFromObject } from '@/shared/lib';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UseFormSetError } from 'react-hook-form';
import { budgetDIContainer } from '../../di/budgetDIContainer';
import { TYPES } from '../../di/budgetDIContainer.type';
import { BudgetUpdateRequest, BudgetUpdateResponse } from '../../domain/entities/Budget';
import { IUpdateBudgetUseCase } from '../../domain/usecases';
import { BudgetCreationFormValues } from '../../presentation/schema';

export const updateBudgetAsyncThunk = createAsyncThunk<
  BudgetUpdateResponse,
  { data: BudgetUpdateRequest; setError: UseFormSetError<BudgetCreationFormValues> },
  { rejectValue: string }
>('budgets/update', async ({ data, setError }, { rejectWithValue }) => {
  try {
    const updateBudgetUseCase = budgetDIContainer.get<IUpdateBudgetUseCase>(
      TYPES.IUpdateBudgetUseCase,
    );

    const response = await updateBudgetUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    setErrorsFromObject(error.message, setError);
    return rejectWithValue(error || 'Failed to update budget');
  }
});
