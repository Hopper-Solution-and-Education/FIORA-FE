import { Currency } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  initialSettingState,
  type CurrencyType,
  type Language,
  type SetExchangeRateSettingsParams,
} from '../types/setting.type';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    ...initialSettingState,
    isFullCurrencyDisplay: true, // mặc định hiển thị đầy đủ
  },
  reducers: {
    changeLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    toggleCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload;
    },
    setExchangeRateSettings: (state, action: PayloadAction<SetExchangeRateSettingsParams>) => {
      state.baseCurrency = action.payload.baseCurrency;
      state.exchangeRate = action.payload.exchangeRate;
    },
    updateExchangeRates: (state, action: PayloadAction<CurrencyType>) => {
      state.exchangeRate = action.payload; // Replace completely instead of merging
      state.updatedAt = Date.now();
    },
    updateExchangeRatesWithTimestamp: (
      state,
      action: PayloadAction<{ rates: CurrencyType; updatedAt: number }>,
    ) => {
      state.exchangeRate = action.payload.rates; // Replace completely instead of merging
      state.updatedAt = action.payload.updatedAt;
    },
    setFullCurrencyDisplay(state, action: PayloadAction<boolean>) {
      state.isFullCurrencyDisplay = action.payload;
    },
    clearExchangeRateData: (state) => {
      state.exchangeRate = {};
      state.updatedAt = 0;
    },
  },
});

export const {
  changeLanguage,
  toggleCurrency,
  setExchangeRateSettings,
  updateExchangeRates,
  updateExchangeRatesWithTimestamp,
  setFullCurrencyDisplay,
  clearExchangeRateData,
} = settingsSlice.actions;

export default settingsSlice.reducer;
