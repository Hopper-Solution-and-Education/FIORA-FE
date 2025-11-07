import { createAsyncThunk } from '@reduxjs/toolkit';
import { membershipDIContainer, TYPES } from '../../di';
import { DeleteBenefitTierRequest, DeleteBenefitTierResponse } from '../../domain/entities';
import { IDeleteBenefitUseCase } from '../../domain/usecases/deleteBenefitUseCase';

export const deleteBenefitAsyncThunk = createAsyncThunk<
  DeleteBenefitTierResponse,
  DeleteBenefitTierRequest,
  { rejectValue: any }
>('membership/deleteBenefit', async (data, { rejectWithValue }) => {
  try {
    const deleteBenefitUseCase = membershipDIContainer.get<IDeleteBenefitUseCase>(
      TYPES.IDeleteBenefitUseCase,
    );

    const response = await deleteBenefitUseCase.execute(data);

    return response;
  } catch (error: any) {
    console.error(error);

    return rejectWithValue(error);
  }
});
