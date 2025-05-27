import { createAsyncThunk } from '@reduxjs/toolkit';
import { financeDIContainer, TYPES } from '../../di';
import { GetFinanceByCategoryRequest, GetFinanceByCategoryResponse } from '../../domain/entities';
import { IGetFinanceByCategoryUseCase } from '../../domain/usecases';

export const getFinanceByCategoryAsyncThunk = createAsyncThunk<
  GetFinanceByCategoryResponse,
  GetFinanceByCategoryRequest,
  { rejectValue: string }
>('finance/getFinanceByCategory', async (data, { rejectWithValue }) => {
  try {
    const getFinanceByCategoryUseCase = financeDIContainer.get<IGetFinanceByCategoryUseCase>(
      TYPES.IGetFinanceByCategoryUseCase,
    );

    const response = await getFinanceByCategoryUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to get finance by category');
  }
});
