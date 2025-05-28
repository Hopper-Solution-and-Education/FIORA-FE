import { createAsyncThunk } from '@reduxjs/toolkit';
import { financeDIContainer, TYPES } from '../../di';
import { GetListPartnerRequest, GetListPartnerResponse } from '../../domain/entities';
import { IGetAllPartnerUseCase } from '../../domain/usecases/getAllPartnersUseCase';

export const getAllPartnerAsyncThunk = createAsyncThunk<
  GetListPartnerResponse,
  GetListPartnerRequest,
  { rejectValue: string }
>('finance/getAllPartner', async (data, { rejectWithValue }) => {
  try {
    const getAllPartnerUseCase = financeDIContainer.get<IGetAllPartnerUseCase>(
      TYPES.IGetAllPartnerUseCase,
    );

    const response = await getAllPartnerUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to get all product');
  }
});
