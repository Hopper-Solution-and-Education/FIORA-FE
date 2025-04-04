import { createAsyncThunk } from '@reduxjs/toolkit';
import { partnerDIContainer } from '../../di/partnerDIContainer';
import { TYPES } from '../../di/partnerDIContainer.type';

interface DeletePartnerParams {
  id: string;
  replacementId?: string;
}

export const deletePartner = createAsyncThunk<
  { id: string }, // Return the ID that was deleted instead of the partner object
  DeletePartnerParams,
  { rejectValue: string }
>('partner/delete', async (params, { rejectWithValue }) => {
  try {
    const deletePartnerUseCase = partnerDIContainer.get(TYPES.IDeletePartnerUseCase);
    await (
      deletePartnerUseCase as { execute: (id: string, replacementId?: string) => Promise<void> }
    ).execute(params.id, params.replacementId);

    // Return the ID that was deleted since the API doesn't return the partner object
    return { id: params.id };
  } catch (error: any) {
    console.error('Error in deletePartner thunk:', error);
    return rejectWithValue(error.message || 'Failed to delete partner');
  }
});
