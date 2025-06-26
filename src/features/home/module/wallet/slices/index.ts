import { createSlice } from '@reduxjs/toolkit';
import type { WalletState } from './types';
import type { FilterCriteria } from '@/shared/types/filter.types';
import {
  getWalletByTypeAsyncThunk,
  getWalletsAsyncThunk,
  getPackageFXAsyncThunk,
  fetchFrozenAmount,
} from './actions';
import type { PackageFX } from '../domain/entity/PackageFX';

const initialState: WalletState = {
  wallets: null,
  packageFX: null,
  loading: false,
  error: null,
  selectedWalletType: null,
  filterCriteria: { userId: '', filters: {}, search: '' },
  minBalance: null,
  maxBalance: null,
  selectedPackageId: null,
  depositProofUrl: null,
  depositSearch: null,
  frozenAmount: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setSelectedWalletType: (state, action) => {
      state.selectedWalletType = action.payload;
    },
    setSelectedPackageId: (state, action) => {
      state.selectedPackageId = action.payload;
    },
    setDepositProofUrl: (state, action) => {
      state.depositProofUrl = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearWallets: (state) => {
      state.wallets = [];
    },
    setWalletSearch: (state, action) => {
      state.filterCriteria.search = action.payload;
    },
    setFilterCriteria: (state, action: { payload: FilterCriteria }) => {
      state.filterCriteria = action.payload;
    },
    setPackageFX: (state, action: { payload: PackageFX[] }) => {
      state.packageFX = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDepositSearch: (state, action) => {
      state.depositSearch = action.payload;
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
        const balance = action.payload.frBalanceActive;
        state.minBalance = balance;
        state.maxBalance = balance;
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
        if (action.payload && action.payload.length > 0) {
          const balances = action.payload.map((w) => w.frBalanceActive);
          state.minBalance = Math.min(...balances);
          state.maxBalance = Math.max(...balances);
        } else {
          state.minBalance = null;
          state.maxBalance = null;
        }
      })
      .addCase(getWalletsAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wallets';
      })
      .addCase(getPackageFXAsyncThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPackageFXAsyncThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.packageFX = action.payload;
        state.error = null;
      })
      .addCase(getPackageFXAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch packageFX';
      })
      .addCase(fetchFrozenAmount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFrozenAmount.fulfilled, (state, action) => {
        state.loading = false;
        state.frozenAmount = action.payload;
        state.error = null;
      })
      .addCase(fetchFrozenAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedWalletType,
  setSelectedPackageId,
  setDepositProofUrl,
  clearError,
  clearWallets,
  setWalletSearch,
  setFilterCriteria,
  setPackageFX,
  setLoading,
  setError,
  setDepositSearch,
} = walletSlice.actions;
export default walletSlice.reducer;
