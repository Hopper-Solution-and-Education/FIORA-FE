import { createAsyncThunk } from '@reduxjs/toolkit';
import { membershipDIContainer, TYPES } from '../../di';
import { UpsertMembershipRequest, UpsertMembershipResponse } from '../../domain/entities';
import { IUpsertMembershipUseCase } from '../../domain/usecases/upsertMembershipUseCase';

export const upsertMembershipAsyncThunk = createAsyncThunk<
  UpsertMembershipResponse,
  UpsertMembershipRequest,
  { rejectValue: string }
>('membership/upsertMembership', async (data, { rejectWithValue }) => {
  try {
    const upsertMembershipUseCase = membershipDIContainer.get<IUpsertMembershipUseCase>(
      TYPES.IUpsertMembershipUseCase,
    );

    const response = await upsertMembershipUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to upsert membership');
  }
});
