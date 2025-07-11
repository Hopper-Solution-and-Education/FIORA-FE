import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { Membership } from '../domain/entities';
import {
  addNewBenefitAsyncThunk,
  deleteBenefitAsyncThunk,
  getListMembershipAsyncThunk,
  upsertMembershipAsyncThunk,
} from './actions';
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
    setIsShowDialogAddBenefitTier: (state, action: PayloadAction<boolean>) => {
      state.isShowDialogAddBenefitTier = action.payload;
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

    builder
      .addCase(addNewBenefitAsyncThunk.pending, (state) => {
        state.isLoadingAddBenefitTier = true;
      })
      .addCase(addNewBenefitAsyncThunk.fulfilled, (state, action) => {
        state.isLoadingAddBenefitTier = false;
        toast.success(action.payload.message);
      })
      .addCase(addNewBenefitAsyncThunk.rejected, (state) => {
        state.isLoadingAddBenefitTier = false;
      });

    builder
      .addCase(deleteBenefitAsyncThunk.pending, (state) => {
        state.isLoadingDeleteBenefitTier = true;
      })
      .addCase(deleteBenefitAsyncThunk.fulfilled, (state, action) => {
        state.isLoadingDeleteBenefitTier = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteBenefitAsyncThunk.rejected, (state, action) => {
        state.isLoadingDeleteBenefitTier = false;
        toast.error(action.payload);
      });
  },
});

export * from './types';
export const {
  resetMembershipState,
  setSelectedMembership,
  setMemberships,
  setIsShowDialogAddBenefitTier,
} = membershipSlice.actions;
export default membershipSlice.reducer;
