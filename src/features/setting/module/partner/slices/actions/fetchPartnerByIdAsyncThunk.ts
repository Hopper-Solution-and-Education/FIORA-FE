import { createAsyncThunk } from '@reduxjs/toolkit';
import { partnerDIContainer } from '../../di/partnerDIContainer';
import { TYPES } from '../../di/partnerDIContainer.type';
import { Partner } from '../../domain/entities/Partner';
import { IGetPartnerByIdUseCase } from '../../domain/usecases/GetPartnerByIdUsecase';

export const fetchPartnerById = createAsyncThunk<Partner, string, { rejectValue: string }>(
  'partner/fetchPartnerById',
  async (id, { rejectWithValue }) => {
    try {
      const getPartnerByIdUseCase = partnerDIContainer.get<IGetPartnerByIdUseCase>(
        TYPES.IGetPartnerByIdUseCase,
      );
      const response = await getPartnerByIdUseCase.execute(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch partner');
    }
  },
);
