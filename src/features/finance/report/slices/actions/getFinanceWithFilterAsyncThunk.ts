import { createAsyncThunk } from '@reduxjs/toolkit';
import { financeDIContainer, TYPES } from '../../di';
import { GetFinanceWithFilterRequest, GetFinanceWithFilterResponse } from '../../domain/entities';
import { IGetFinanceWithFiltersUseCase } from '../../domain/usecases';

export const getFinanceWithFilterAsyncThunk = createAsyncThunk<
  GetFinanceWithFilterResponse,
  GetFinanceWithFilterRequest,
  { rejectValue: string }
>('finance/getFinanceWithFilter', async (data, { rejectWithValue }) => {
  try {
    const getFinanceWithFiltersUseCase = financeDIContainer.get<IGetFinanceWithFiltersUseCase>(
      TYPES.IGetFinanceWithFiltersUseCase,
    );

    const response = await getFinanceWithFiltersUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to get finance with filter');
  }
});
