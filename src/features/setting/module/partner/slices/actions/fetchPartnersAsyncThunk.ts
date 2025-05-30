import { createAsyncThunk } from '@reduxjs/toolkit';
import { partnerDIContainer } from '../../di/partnerDIContainer';
import { TYPES } from '../../di/partnerDIContainer.type';
import { IGetPartnerUseCase } from '../../domain/usecases/GetPartnerUsecase';
import { GetPartnerAPIRequestDTO } from '../../data/dto/request/GetPartnerAPIRequestDTO';
import { Response } from '@/shared/types/Common.types';
import { PartnerResponse } from '../types';

export const fetchPartners = createAsyncThunk<
  Response<PartnerResponse>,
  GetPartnerAPIRequestDTO,
  { rejectValue: string }
>('partner/fetchPartners', async (data, { rejectWithValue }) => {
  try {
    const getPartnerUseCase = partnerDIContainer.get<IGetPartnerUseCase>(TYPES.IGetPartnerUseCase);
    const response = await getPartnerUseCase.execute(data);

    // The API already returns the correct structure with data, minIncome, maxIncome, minExpense, maxExpense
    // So we can return it directly
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to fetch partners');
  }
});
