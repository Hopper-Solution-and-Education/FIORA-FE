import { createAsyncThunk } from '@reduxjs/toolkit';
import { partnerDIContainer } from '../../di/partnerDIContainer';
import { TYPES } from '../../di/partnerDIContainer.type';
import { Partner } from '../../domain/entities/Partner';
import { IDeletePartnerUseCase } from '../../domain/usecases/DeletePartnerUsecase';

export const deletePartner = createAsyncThunk<Partner, string, { rejectValue: string }>(
  'partner/deletePartner',
  async (id, { rejectWithValue }) => {
    try {
      // Get the delete partner use case from the DI container
      const deletePartnerUseCase = partnerDIContainer.get<IDeletePartnerUseCase>(
        TYPES.IDeletePartnerUseCase,
      );

      // Execute the use case with the partner ID
      const response = await deletePartnerUseCase.execute(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete partner');
    }
  },
);
