import accountSlice from '@/features/home/module/account/slices';

import budgetControlSlice from '@/features/home/module/budgets/slices';
import categorySlice from '@/features/home/module/category/slices';
import transactionSlice from '@/features/home/module/transaction/slices';
import landingSlices from '@/features/landing/slices';
import landingSettingSlice from '@/features/setting/module/landing/landing/slices';
import partnerManagementSlice from '@/features/setting/module/partner/slices';
import productManagementSlice from '@/features/setting/module/product/slices';
import { combineReducers } from '@reduxjs/toolkit';
import dialogSlices from './slices/dialog.slice';
import moduleReducer from './slices/moduleSlice';
import settingSlices from './slices/setting.slice';
import { budgetSummarySlice } from '@/features/home/module/budgets/summary';

const reducer = {
  settings: settingSlices,
  dialog: dialogSlices,
  landing: landingSlices,
  landingSettings: landingSettingSlice,
  budgetControl: budgetControlSlice,
  budgetSummary: budgetSummarySlice,
  productManagement: productManagementSlice,
  category: categorySlice,
  account: accountSlice,
  partner: partnerManagementSlice,
  transaction: transactionSlice,
  module: moduleReducer,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
