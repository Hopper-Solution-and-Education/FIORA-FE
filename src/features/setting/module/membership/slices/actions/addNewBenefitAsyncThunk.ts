import { setErrorsFromObject } from '@/shared/lib/forms/setErrorsFromObject';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UseFormSetError } from 'react-hook-form';
import { membershipDIContainer, TYPES } from '../../di';
import { AddBenefitTierRequest, AddBenefitTierResponse } from '../../domain/entities';
import { IAddNewBenefitUseCase } from '../../domain/usecases/addNewBenefitUseCase';
import { AddBenefitTierFormValues } from '../../presentation/schema';

export const addNewBenefitAsyncThunk = createAsyncThunk<
  AddBenefitTierResponse,
  { data: AddBenefitTierRequest; setError: UseFormSetError<AddBenefitTierFormValues> },
  { rejectValue: string }
>('membership/addNewBenefit', async ({ data, setError }, { rejectWithValue }) => {
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
