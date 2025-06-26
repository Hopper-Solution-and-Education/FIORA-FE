import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Membership } from '../domain/entities';
import { getListMembershipAsyncThunk } from './actions/getMemberShipAsyncThunk';
import { initialMembershipState } from './types';

const membershipSlice = createSlice({
  name: 'membership',
  initialState: initialMembershipState,
  reducers: {
    resetMembershipState: () => initialMembershipState,
    setMemberships: (state, action: PayloadAction<Membership[]>) => {
      state.memberships = action.payload;
    },
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
      });
  },
});

export * from './types';
export const { resetMembershipState, setSelectedMembership, setMemberships } =
  membershipSlice.actions;
export default membershipSlice.reducer;
