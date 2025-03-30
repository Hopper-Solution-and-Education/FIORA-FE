import { createAsyncThunk } from '@reduxjs/toolkit';
import { partnerDIContainer } from '../../di/partnerDIContainer';
import { TYPES } from '../../di/partnerDIContainer.type';
import { Partner } from '../../domain/entities/Partner';
import { IUpdatePartnerUseCase } from '../../domain/usecases/UpdatePartnerUsecase';

export const updatePartner = createAsyncThunk<Partner, any, { rejectValue: string }>(
  'partner/updatePartner',
  async (data, { rejectWithValue }) => {
    try {
      const updatePartnerUseCase = partnerDIContainer.get<IUpdatePartnerUseCase>(
        TYPES.IUpdatePartnerUseCase,
      );
      const response = await updatePartnerUseCase.execute(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update partner');
    }
  },
);
