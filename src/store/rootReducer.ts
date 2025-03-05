import { combineReducers } from '@reduxjs/toolkit';
import taskSlice from '@/features/dashboard/module/kanban/slices';
import landingSlices from '@/features/landing/slices';
import expenseIncomeReducer from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import dialogSlices from './slices/dialog.slice';
import settingSlices from './slices/setting.slice';

const reducer = {
  settings: settingSlices,
  dialog: dialogSlices,
  landing: landingSlices,
  task: taskSlice,
  expenseIncome: expenseIncomeReducer,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
