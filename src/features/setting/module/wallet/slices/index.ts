import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  WALLET_SETTING_TABLE_COLUMN_CONFIG,
  WalletSettingTableColumnKey,
} from '../presentation/types/setting.type';
import { updateDepositRequestStatusAsyncThunk } from './actions';
import { initialState } from './types';

const walletSettingSlice = createSlice({
  name: 'walletSetting',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    toggleColumn: (state, action: PayloadAction<WalletSettingTableColumnKey>) => {
      const col = action.payload;
      state.columnConfig[col].isVisible = !state.columnConfig[col].isVisible;
    },
    resetColumns: (state) => {
      state.columnConfig = JSON.parse(JSON.stringify(WALLET_SETTING_TABLE_COLUMN_CONFIG));
    },
    updateColumnIndex: (
      state,
      action: PayloadAction<{ key: WalletSettingTableColumnKey; newIndex: number }[]>,
    ) => {
      action.payload.forEach(({ key, newIndex }) => {
        state.columnConfig[key].index = newIndex;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateDepositRequestStatusAsyncThunk.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.updatingItems.push(id);
        state.error = null;
      })
      .addCase(updateDepositRequestStatusAsyncThunk.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        state.updatingItems = state.updatingItems.filter((itemId) => itemId !== id);
        state.error = null;
      })
      .addCase(updateDepositRequestStatusAsyncThunk.rejected, (state, action) => {
        const { id } = action.meta.arg;
        state.updatingItems = state.updatingItems.filter((itemId) => itemId !== id);
        state.error = action.payload || 'Update deposit request status failed';
      });
  },
});

export const { setLoading, setError, clearError, toggleColumn, resetColumns, updateColumnIndex } =
  walletSettingSlice.actions;
export default walletSettingSlice.reducer;
