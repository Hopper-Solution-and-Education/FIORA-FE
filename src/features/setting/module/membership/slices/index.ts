import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { Membership } from '../domain/entities';
import { getListMembershipAsyncThunk } from './actions/getMemberShipAsyncThunk';
import { upsertMembershipAsyncThunk } from './actions/upsertMembershipAsyncThunk';
import { initialMembershipState } from './types';

const membershipSlice = createSlice({
  name: 'membership',
  initialState: initialMembershipState,
  reducers: {
    resetMembershipState: () => initialMembershipState,
    setSelectedMembership: (state, action: PayloadAction<Membership>) => {
      state.selectedMembership = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListMembershipAsyncThunk.pending, (state) => {
        state.isLoadingGetMemberships = true;
      })
      .addCase(getListMembershipAsyncThunk.fulfilled, (state, action) => {
        state.isLoadingGetMemberships = false;
        state.memberships = action.payload.data;
      })
      .addCase(getListMembershipAsyncThunk.rejected, (state) => {
        state.isLoadingGetMemberships = false;
      })
      .addCase(upsertMembershipAsyncThunk.pending, (state) => {
        state.isLoadingUpsertMembership = true;
      })
      .addCase(upsertMembershipAsyncThunk.fulfilled, (state, action) => {
        state.isLoadingUpsertMembership = false;
        const index = state.memberships.findIndex((item) => item.id === action.payload.data.id);
        if (index !== -1) {
          state.memberships[index] = action.payload.data;
        } else {
          state.memberships.push(action.payload.data);
        }
        toast.success(action.payload.message);
      })
      .addCase(upsertMembershipAsyncThunk.rejected, (state) => {
        state.isLoadingUpsertMembership = false;
      });
  },
});

export * from './types';
export const { resetMembershipState, setSelectedMembership } = membershipSlice.actions;
export default membershipSlice.reducer;
