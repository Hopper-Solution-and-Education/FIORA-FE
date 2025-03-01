import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialLandingState } from './landing.type';

const landingSlice = createSlice({
  name: 'landing',
  initialState: initialLandingState,
  reducers: {
    changeShowDialog(state, action: PayloadAction<boolean>) {
      state.isShowDialog = action.payload;
    },
  },
});

export const { changeShowDialog } = landingSlice.actions;

export default landingSlice.reducer;
