import { createSlice } from '@reduxjs/toolkit';
import { getWalletAsyncThunk } from './actions/GetWalletAsynThunk';
import type { WalletState } from './types';

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
      .addCase(getWalletAsyncThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletAsyncThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets = [action.payload];
        state.error = null;
      })
      .addCase(getWalletAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wallet';
      });
  },
});

export const { setSelectedWalletType, clearError, clearWallets } = walletSlice.actions;
export default walletSlice.reducer;
