import { Response } from '@/shared/types/Common.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchAccounts } from './actions';
import { Account, initialAccountState } from './types';

const accountSlice = createSlice({
  name: 'account',
  initialState: initialAccountState,
  reducers: {
    setAccounts(state, action: PayloadAction<Response<Account[]>>) {
      state.accounts.data = action.payload.data;
      state.accounts.isLoading = false;
      state.accounts.error = null;
    },
    reset: () => initialAccountState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.accounts.isLoading = true;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts.isLoading = false;
        state.accounts.data = action.payload.data;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.accounts.isLoading = false;
        state.accounts.error = (action.payload as { message: string })?.message || 'Unknown error';
      });
  },
});

export const { setAccounts, reset } = accountSlice.actions;
export default accountSlice.reducer;
