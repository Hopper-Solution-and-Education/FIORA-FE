import { combineReducers } from '@reduxjs/toolkit';
import taskSlice from '@/features/dashboard/module/kanban/slices';
import landingSlices from '@/features/landing/slices';
import expenseIncomeReducer from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import dialogSlices from './slices/dialog.slice';
import settingSlices from './slices/setting.slice';
import budgetSlice from '@/features/dashboard/module/budget-control/slices/budgetSlice';
import landingSettingSlice from '@/features/admin/banner/slices';

const reducer = {
  settings: settingSlices,
  dialog: dialogSlices,
  landing: landingSlices,
  landingSettings: landingSettingSlice,
  task: taskSlice,
  budget: budgetSlice,
  expenseIncome: expenseIncomeReducer,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
