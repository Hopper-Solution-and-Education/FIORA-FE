import accountSlice from '@/features/home/module/account/slices';

import financeControlSlice from '@/features/finance/report/slices';
import {
  default as budgetControlSlice,
  default as budgetSummarySlice,
} from '@/features/home/module/budgets/creation-dashboard/slices';
import categorySlice from '@/features/home/module/category/slices';
import transactionSlice from '@/features/home/module/transaction/slices';
import landingSlices from '@/features/landing/slices';
import landingSettingSlice from '@/features/setting/module/landing/slices';
import memberShipSettingsSlice from '@/features/setting/module/membership/slices';
import partnerManagementSlice from '@/features/setting/module/partner/slices';
import productManagementSlice from '@/features/setting/module/product/slices';
import { combineReducers } from '@reduxjs/toolkit';
import dialogSlices from './slices/dialog.slice';
import moduleReducer from './slices/moduleSlice';
import settingSlices from './slices/setting.slice';

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
  financeControl: financeControlSlice,
  memberShipSettings: memberShipSettingsSlice,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
