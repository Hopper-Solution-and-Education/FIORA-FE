import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createPackageFx,
  deletePackageFx,
  fetchPackageFx,
  getPackageFxById,
  updatePackageFx,
} from './actions';
import { initialPackageFxState, PackageFXWithAttachments } from './types';

const packageFxSlice = createSlice({
  name: 'packageFx',
  initialState: initialPackageFxState,
  reducers: {
    setDeleteConfirmOpen(state, action: PayloadAction<boolean>) {
      state.deleteConfirmOpen = action.payload;
    },
    setSelectedPackage(state, action: PayloadAction<PackageFXWithAttachments | null>) {
      state.selectedPackage = action.payload;
    },
    clearError(state) {
      state.packages.error = null;
    },
    reset: () => initialPackageFxState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchPackageFx.pending, (state) => {
        state.packages.isLoading = true;
        state.packages.error = null;
      })
      .addCase(fetchPackageFx.fulfilled, (state, action) => {
        state.packages.isLoading = false;
        state.packages.data = action.payload.data.map((pkg: any) => ({
          ...pkg,
          attachments: pkg.attachments ?? [],
        }));
        state.packages.message = action.payload.message;
      })
      .addCase(fetchPackageFx.rejected, (state, action) => {
        state.packages.isLoading = false;
        state.packages.error = (action.payload as { message: string })?.message || 'Unknown error';
      })

      // Create package
      .addCase(createPackageFx.pending, (state) => {
        state.packages.isLoading = true;
        state.packages.error = null;
      })
      .addCase(createPackageFx.fulfilled, (state, action) => {
        state.packages.isLoading = false;
        if (state.packages.data) {
          state.packages.data.push({
            ...action.payload.data,
            attachments: action.payload.data.attachments ?? [],
          });
        }
      })
      .addCase(createPackageFx.rejected, (state, action) => {
        state.packages.isLoading = false;
        state.packages.error = (action.payload as { message: string })?.message || 'Unknown error';
      })

      // Update package
      .addCase(updatePackageFx.pending, (state) => {
        state.packages.isLoading = true;
        state.packages.error = null;
      })
      .addCase(updatePackageFx.fulfilled, (state, action) => {
        state.packages.isLoading = false;
        if (state.packages.data) {
          const index = state.packages.data.findIndex((pkg) => pkg.id === action.payload.data.id);
          if (index !== -1) {
            state.packages.data[index] = {
              ...action.payload.data,
              attachments: action.payload.data.attachments ?? [],
            };
          }
        }
      })
      .addCase(updatePackageFx.rejected, (state, action) => {
        state.packages.isLoading = false;
        state.packages.error = (action.payload as { message: string })?.message || 'Unknown error';
      })

      // Delete package
      .addCase(deletePackageFx.pending, (state) => {
        state.packages.isLoading = true;
        state.packages.error = null;
      })
      .addCase(deletePackageFx.fulfilled, (state, action) => {
        state.packages.isLoading = false;
        if (state.packages.data) {
          state.packages.data = state.packages.data.filter(
            (pkg) => pkg.id !== action.payload.data.id,
          );
        }
        state.deleteConfirmOpen = false;
        state.selectedPackage = null;
      })
      .addCase(deletePackageFx.rejected, (state, action) => {
        state.packages.isLoading = false;
        state.packages.error = (action.payload as { message: string })?.message || 'Unknown error';
      })

      // Get package by ID
      .addCase(getPackageFxById.pending, (state) => {
        state.packages.isLoading = true;
        state.packages.error = null;
      })
      .addCase(getPackageFxById.fulfilled, (state, action) => {
        state.packages.isLoading = false;
        state.selectedPackage = {
          ...action.payload.data,
          attachments: action.payload.data.attachments ?? [],
        };
      })
      .addCase(getPackageFxById.rejected, (state, action) => {
        state.packages.isLoading = false;
        state.packages.error = (action.payload as { message: string })?.message || 'Unknown error';
      });
  },
});

export const { setDeleteConfirmOpen, setSelectedPackage, clearError, reset } =
  packageFxSlice.actions;

export default packageFxSlice.reducer;
