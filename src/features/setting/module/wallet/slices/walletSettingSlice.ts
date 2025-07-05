import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletSettingState {
  loading: boolean;
  error: string | null;
}

const initialState: WalletSettingState = {
  loading: false,
  error: null,
};

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
  },
});

export const { setLoading, setError, clearError } = walletSettingSlice.actions;
export default walletSettingSlice.reducer;
