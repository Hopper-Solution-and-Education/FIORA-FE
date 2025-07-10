import { createAsyncThunk } from '@reduxjs/toolkit';
import { membershipDIContainer, TYPES } from '../../di';
import { AddBenefitTierRequest, AddBenefitTierResponse } from '../../domain/entities';
import { IAddNewBenefitUseCase } from '../../domain/usecases/addNewBenefitUseCase';

export const addNewBenefitAsyncThunk = createAsyncThunk<
  AddBenefitTierResponse,
  AddBenefitTierRequest,
  { rejectValue: string }
>('membership/addNewBenefit', async (data, { rejectWithValue }) => {
  try {
    const addNewBenefitUseCase = membershipDIContainer.get<IAddNewBenefitUseCase>(
      TYPES.IAddNewBenefitUseCase,
    );

    const response = await addNewBenefitUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to upsert membership');
  }
});
