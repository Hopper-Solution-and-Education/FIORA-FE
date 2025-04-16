'use client';

import { Currency } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialSettingState, Language } from '../types/setting.type';

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
  },
});

export const { changeLanguage, toggleCurrency } = settingsSlice.actions;

export default settingsSlice.reducer;
