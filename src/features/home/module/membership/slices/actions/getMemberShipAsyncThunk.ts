import { createAsyncThunk } from '@reduxjs/toolkit';
import { membershipDIContainer, TYPES } from '../../di';
import { GetListMembershipsRequest, GetListMembershipsResponse } from '../../domain/entities';
import { IGetListMembershipUseCase } from '../../domain/usecases/getListMembershipUseCase';

export const getListMembershipAsyncThunk = createAsyncThunk<
  GetListMembershipsResponse,
  GetListMembershipsRequest,
  { rejectValue: string }
>('membership/getListMembership', async (data, { rejectWithValue }) => {
  try {
    const getListMembershipUseCase = membershipDIContainer.get<IGetListMembershipUseCase>(
      TYPES.IGetListMembershipUseCase,
    );

    const response = await getListMembershipUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to get list membership');
  }
});
