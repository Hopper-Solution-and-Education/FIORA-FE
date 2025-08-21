import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { Membership } from '../domain/entities';
import {
  addUpdateNewBenefitAsyncThunk,
  deleteBenefitAsyncThunk,
  editThresholdBenefitAsyncThunk,
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
      .addCase(addUpdateNewBenefitAsyncThunk.pending, (state) => {
        state.isLoadingAddUpdateBenefitTier = true;
      })
      .addCase(addUpdateNewBenefitAsyncThunk.fulfilled, (state, action) => {
        state.isLoadingAddUpdateBenefitTier = false;
        toast.success(action.payload.message);
      })
      .addCase(addUpdateNewBenefitAsyncThunk.rejected, (state) => {
        state.isLoadingAddUpdateBenefitTier = false;
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

    builder
      .addCase(editThresholdBenefitAsyncThunk.pending, (state) => {
        state.isLoadingEditThresholdBenefit = true;
      })
      .addCase(editThresholdBenefitAsyncThunk.fulfilled, (state, action) => {
        state.isLoadingEditThresholdBenefit = false;
        toast.success(action.payload.message);
      })
      .addCase(editThresholdBenefitAsyncThunk.rejected, (state, action) => {
        state.isLoadingEditThresholdBenefit = false;
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
