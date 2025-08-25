import { createAsyncThunk } from '@reduxjs/toolkit';
import { membershipDIContainer, TYPES } from '../../di';
import { EditThresholdBenefitRequest, EditThresholdBenefitResponse } from '../../domain/entities';
import { IEditThresholdBenefitUseCase } from '../../domain/usecases/editThresholdBenefitUseCase';

export const editThresholdBenefitAsyncThunk = createAsyncThunk<
  EditThresholdBenefitResponse,
  EditThresholdBenefitRequest,
  { rejectValue: string }
>('membership/editThresholdBenefit', async (data, { rejectWithValue }) => {
  try {
    const editThresholdBenefitUseCase = membershipDIContainer.get<IEditThresholdBenefitUseCase>(
      TYPES.IEditThresholdBenefitUseCase,
    );

    const response = await editThresholdBenefitUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error.message || 'Failed to edit threshold benefit');
  }
});
