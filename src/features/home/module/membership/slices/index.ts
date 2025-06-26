import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Membership } from '../domain/entities';
import { getCurrentTierAsyncThunk, getListMembershipAsyncThunk } from './actions';
import { initialMembershipState } from './types';

const membershipSlice = createSlice({
  name: 'membership',
  initialState: initialMembershipState,
  reducers: {
    resetMembershipState: () => initialMembershipState,
    setMemberships: (state, action: PayloadAction<Membership[]>) => {
      state.memberships = action.payload;
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

    builder.addCase(getCurrentTierAsyncThunk.pending, (state) => {
      state.userTier.isLoading = true;
    });
    builder.addCase(getCurrentTierAsyncThunk.fulfilled, (state, action) => {
      state.userTier.isLoading = false;
      state.userTier.data = action.payload;
    });
    builder.addCase(getCurrentTierAsyncThunk.rejected, (state) => {
      state.userTier.isLoading = false;
    });
  },
});

export * from './types';
export const { resetMembershipState, setMemberships } = membershipSlice.actions;
export default membershipSlice.reducer;
