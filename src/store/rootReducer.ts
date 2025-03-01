import { combineReducers } from '@reduxjs/toolkit';
import dialogSlices from './slices/dialog.slice';
import settingSlices from './slices/setting.slice';
import landingSlices from '@/features/landing/slices';

const reducer = {
  settings: settingSlices,
  dialog: dialogSlices,
  landing: landingSlices,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
