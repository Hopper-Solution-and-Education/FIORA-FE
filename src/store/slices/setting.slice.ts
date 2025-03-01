import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialSettingState, Language } from '../types/setting.type';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingState,
  reducers: {
    changeLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { toggleTheme, setIsDarkMode, changeLanguage } = settingsSlice.actions;

export default settingsSlice.reducer;
