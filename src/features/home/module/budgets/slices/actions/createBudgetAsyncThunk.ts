import { createAsyncThunk } from '@reduxjs/toolkit';
import { UseFormSetError } from 'react-hook-form';
import { budgetDIContainer } from '../../di/budgetDIContainer';
import { TYPES } from '../../di/budgetDIContainer.type';
import { BudgetCreateRequest, BudgetCreateResponse } from '../../domain/entities/Budget';
import { ICreateBudgetUseCase } from '../../domain/usecases';
import { BudgetCreationFormValues } from '../../presentation/schema';
import { setErrorsFromObject } from '@/shared/lib';

export const createBudgetAsyncThunk = createAsyncThunk<
  BudgetCreateResponse,
  { data: BudgetCreateRequest; setError: UseFormSetError<BudgetCreationFormValues> },
  { rejectValue: string }
>('budgets/create', async ({ data, setError }, { rejectWithValue }) => {
  try {
    const createBudgetUseCase = budgetDIContainer.get<ICreateBudgetUseCase>(
      TYPES.ICreateBudgetUseCase,
    );

    const response = await createBudgetUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    setErrorsFromObject(error.message, setError);
    return rejectWithValue(error || 'Failed to create budget');
  }
});
