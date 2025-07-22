'use client';

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
  initialState: initialSettingState,
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
      state.exchangeRate = { ...state.exchangeRate, ...action.payload };
      state.updatedAt = Date.now();
    },
    updateExchangeRatesWithTimestamp: (
      state,
      action: PayloadAction<{ rates: CurrencyType; updatedAt: number }>,
    ) => {
      state.exchangeRate = { ...state.exchangeRate, ...action.payload.rates };
      state.updatedAt = action.payload.updatedAt;
    },
  },
});

export const {
  changeLanguage,
  toggleCurrency,
  setExchangeRateSettings,
  updateExchangeRates,
  updateExchangeRatesWithTimestamp,
} = settingsSlice.actions;

export default settingsSlice.reducer;
