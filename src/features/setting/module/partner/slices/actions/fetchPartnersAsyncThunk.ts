import { createAsyncThunk } from '@reduxjs/toolkit';
import { partnerDIContainer } from '../../di/partnerDIContainer';
import { TYPES } from '../../di/partnerDIContainer.type';
import { Partner } from '../../domain/entities/Partner';
import { IGetPartnerUseCase } from '../../domain/usecases/GetPartnerUsecase';
import { GetPartnerAPIRequestDTO } from '../../data/dto/request/GetPartnerAPIRequestDTO';

export const fetchPartners = createAsyncThunk<
  Partner[],
  GetPartnerAPIRequestDTO,
  { rejectValue: string }
>('partner/fetchPartners', async (data, { rejectWithValue }) => {
  try {
    const getPartnerUseCase = partnerDIContainer.get<IGetPartnerUseCase>(TYPES.IGetPartnerUseCase);
    const response = await getPartnerUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch partners');
  }
});
