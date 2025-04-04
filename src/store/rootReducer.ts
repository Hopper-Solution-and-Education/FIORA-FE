import accountSlice from '@/features/home/module/account/slices';
import budgetSlice from '@/features/home/module/budget-control/slices/budgetSlice';
import categorySlice from '@/features/home/module/category/slices';
import transactionSlice from '@/features/home/module/transaction/slices';
import landingSlices from '@/features/landing/slices';
import landingSettingSlice from '@/features/setting/module/landing/landing/slices';
import partnerManagementSlice from '@/features/setting/module/partner/slices';
import productManagementSlice from '@/features/setting/module/product/slices';
import { combineReducers } from '@reduxjs/toolkit';
import dialogSlices from './slices/dialog.slice';
import settingSlices from './slices/setting.slice';

const reducer = {
  settings: settingSlices,
  dialog: dialogSlices,
  landing: landingSlices,
  landingSettings: landingSettingSlice,
  budget: budgetSlice,
  productManagement: productManagementSlice,
  category: categorySlice,
  account: accountSlice,
  partner: partnerManagementSlice,
  transaction: transactionSlice,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
