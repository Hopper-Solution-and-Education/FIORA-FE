// src/features/setting/module/partner/slices/index.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { Partner } from '../domain/entities/Partner';
// import { createPartner } from './actions/createPartnerAsyncThunk'; // Giả định đã có
import { fetchPartners } from './actions/fetchPartnersAsyncThunk';
import { updatePartner } from './actions/updatePartnerAsyncThunk';
import { initialPartnerState } from './types';

const partnerManagementSlice = createSlice({
  name: 'partnerManagement',
  initialState: initialPartnerState,
  reducers: {
    resetPartnerManagementState: () => initialPartnerState,
  },
  extraReducers: (builder) => {
    // Fetch Partners
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
        state.isLoading = false;
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch partners';
      });

    // Create Partner (giả định đã có createPartner)
    // builder
    //   .addCase(createPartner.pending, (state) => {
    //     state.isCreatingPartner = true;
    //   })
    //   .addCase(createPartner.fulfilled, (state, action: PayloadAction<Partner>) => {
    //     state.isCreatingPartner = false;
    //     state.partners.push(action.payload);
    //     toast.success('Success', { description: 'Create partner successfully!!' });
    //   })
    //   .addCase(createPartner.rejected, (state, action) => {
    //     state.isCreatingPartner = false;
    //     toast.error('Failed to create partner', {
    //       description: action.payload || 'Failed to create partner',
    //     });
    //   });

    // Update Partner
    builder
      .addCase(updatePartner.pending, (state) => {
        state.isUpdatingPartner = true;
      })
      .addCase(updatePartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.isUpdatingPartner = false;
        const updatedPartner = action.payload;
        const index = state.partners.findIndex((item) => item.id === updatedPartner.id);
        if (index !== -1) {
          state.partners[index] = updatedPartner;
        }
        toast.success('Success', { description: 'Update partner successfully!!' });
      })
      .addCase(updatePartner.rejected, (state, action) => {
        state.isUpdatingPartner = false;
        state.error = action.payload || 'Failed to update partner';
      });
  },
});

export const { resetPartnerManagementState } = partnerManagementSlice.actions;
export default partnerManagementSlice.reducer;
