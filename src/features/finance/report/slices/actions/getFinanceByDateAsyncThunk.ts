import { createAsyncThunk } from '@reduxjs/toolkit';
import { financeDIContainer, TYPES } from '../../di';
import { GetFinanceByDateRequest, GetFinanceByDateResponse } from '../../domain/entities';
import { IGetFinanceByDateUseCase } from '../../domain/usecases';

export const getFinanceByDateAsyncThunk = createAsyncThunk<
  GetFinanceByDateResponse,
  GetFinanceByDateRequest,
  { rejectValue: string }
>('finance/getFinanceByDate', async (data, { rejectWithValue }) => {
  try {
    const getFinanceByDateUseCase = financeDIContainer.get<IGetFinanceByDateUseCase>(
      TYPES.IGetFinanceByDateUseCase,
    );

    const response = await getFinanceByDateUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to create budget');
  }
});
