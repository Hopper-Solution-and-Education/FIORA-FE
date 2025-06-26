import { createAsyncThunk } from '@reduxjs/toolkit';
import { membershipDIContainer, TYPES } from '../../di';
import { GetCurrentTierResponse } from '../../domain/entities';
import { IGetCurrentTierUseCase } from '../../domain/usecases/getCurrentTierUseCase';

export const getCurrentTierAsyncThunk = createAsyncThunk<
  GetCurrentTierResponse,
  void,
  { rejectValue: string }
>('membership/getCurrentTier', async (_, { rejectWithValue }) => {
  try {
    const getCurrentTierUseCase = membershipDIContainer.get<IGetCurrentTierUseCase>(
      TYPES.IGetCurrentTierUseCase,
    );

    const response = await getCurrentTierUseCase.execute();
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to get current tier');
  }
});
