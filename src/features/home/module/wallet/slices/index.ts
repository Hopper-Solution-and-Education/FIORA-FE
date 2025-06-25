import { createSlice } from '@reduxjs/toolkit';
import type { WalletState } from './types';
import { getWalletByTypeAsyncThunk, getWalletsAsyncThunk } from './actions';

const initialState: WalletState = {
  wallets: [],
  loading: false,
  error: null,
  selectedWalletType: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setSelectedWalletType: (state, action) => {
      state.selectedWalletType = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearWallets: (state) => {
      state.wallets = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWalletByTypeAsyncThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletByTypeAsyncThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets = [action.payload];
        state.error = null;
      })
      .addCase(getWalletByTypeAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wallet';
      })
      .addCase(getWalletsAsyncThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletsAsyncThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets = action.payload;
        state.error = null;
      })
      .addCase(getWalletsAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wallets';
      });
  },
});

export const { setSelectedWalletType, clearError, clearWallets } = walletSlice.actions;
export default walletSlice.reducer;
