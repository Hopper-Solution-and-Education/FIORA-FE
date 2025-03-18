import { combineReducers } from '@reduxjs/toolkit';
import taskSlice from '@/features/home/module/kanban/slices';
import landingSlices from '@/features/landing/slices';
import categorySlice from '@/features/home/module/category/slices';
import dialogSlices from './slices/dialog.slice';
import settingSlices from './slices/setting.slice';
import budgetSlice from '@/features/home/module/budget-control/slices/budgetSlice';
import landingSettingSlice from '@/features/admin/landing/slices';
import productManagementSlice from '@/features/home/module/product/slices';

const reducer = {
  settings: settingSlices,
  dialog: dialogSlices,
  landing: landingSlices,
  landingSettings: landingSettingSlice,
  task: taskSlice,
  budget: budgetSlice,
  expenseIncome: expenseIncomeReducer,
  productManagement: productManagementSlice,
  category: categorySlice,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
