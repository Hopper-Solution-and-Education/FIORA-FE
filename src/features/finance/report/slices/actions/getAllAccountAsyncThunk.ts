import { createAsyncThunk } from '@reduxjs/toolkit';
import { financeDIContainer, TYPES } from '../../di';
import { GetListAccountRequest, GetListAccountResponse } from '../../domain/entities';
import { IGetAllAccountUseCase } from '../../domain/usecases/getAllAccountsUseCase';

export const getAllAccountAsyncThunk = createAsyncThunk<
  GetListAccountResponse,
  GetListAccountRequest,
  { rejectValue: string }
>('finance/getAllAccount', async (data, { rejectWithValue }) => {
  try {
    const getAllAccountUseCase = financeDIContainer.get<IGetAllAccountUseCase>(
      TYPES.IGetAllAccountUseCase,
    );

    const response = await getAllAccountUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to get all account');
  }
});
