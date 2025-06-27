import { membershipDIContainer, TYPES } from '@/features/home/module/membership/di';
import { GetCurrentTierResponse } from '@/features/home/module/membership/domain/entities';
import { IGetCurrentTierUseCase } from '@/features/home/module/membership/domain/usecases';
import { createAsyncThunk } from '@reduxjs/toolkit';

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
