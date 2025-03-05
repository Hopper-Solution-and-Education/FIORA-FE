import taskSlice from '@/features/dashboard/module/kanban/slices';
import landingSlices from '@/features/landing/slices';
import { combineReducers } from '@reduxjs/toolkit';
import dialogSlices from './slices/dialog.slice';
import settingSlices from './slices/setting.slice';
import budgetSlice from '@/features/dashboard/module/budget-control/slices/budgetSlice';

const reducer = {
  settings: settingSlices,
  dialog: dialogSlices,
  landing: landingSlices,
  task: taskSlice,
  budget: budgetSlice,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
