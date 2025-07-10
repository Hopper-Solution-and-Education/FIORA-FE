'use client';

import { Currency } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  initialSettingState,
  type ExchangeRateType,
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
    updateExchangeRates: (state, action: PayloadAction<ExchangeRateType>) => {
      state.exchangeRate = { ...state.exchangeRate, ...action.payload };
    },
  },
});

export const { changeLanguage, toggleCurrency, setExchangeRateSettings, updateExchangeRates } =
  settingsSlice.actions;

export default settingsSlice.reducer;
