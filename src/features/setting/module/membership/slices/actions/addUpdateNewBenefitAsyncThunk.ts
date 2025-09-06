import { setErrorsFromObject } from '@/shared/lib/forms/setErrorsFromObject';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UseFormSetError } from 'react-hook-form';
import { membershipDIContainer, TYPES } from '../../di';
import { AddUpdateBenefitTierRequest, AddUpdateBenefitTierResponse } from '../../domain/entities';
import { IAddNewBenefitUseCase } from '../../domain/usecases/addNewBenefitUseCase';

export const addUpdateNewBenefitAsyncThunk = createAsyncThunk<
  AddUpdateBenefitTierResponse,
  { data: AddUpdateBenefitTierRequest; setError: UseFormSetError<any> },
  { rejectValue: string }
>('membership/addUpdateNewBenefit', async ({ data, setError }, { rejectWithValue }) => {
  try {
    const addNewBenefitUseCase = membershipDIContainer.get<IAddNewBenefitUseCase>(
      TYPES.IAddNewBenefitUseCase,
    );

    const response = await addNewBenefitUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    setErrorsFromObject(error.message, setError);
    return rejectWithValue(error || 'Failed to upsert membership');
  }
});
