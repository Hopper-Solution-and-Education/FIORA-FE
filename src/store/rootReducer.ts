import financeControlSlice from '@/features/finance/report/slices';
import { helpsCenterApi } from '@/features/helps-center/store/api/helpsCenterApi';
import accountSlice from '@/features/home/module/account/slices';
import { default as budgetControlSlice } from '@/features/home/module/budgets/creation-dashboard/slices';
import budgetSummarySlice from '@/features/home/module/budgets/summary-detail/slice/budgetSummarySlice';
import categorySlice from '@/features/home/module/category/slices';
import membershipSlice from '@/features/home/module/membership/slices';
import transactionSlice from '@/features/home/module/transaction/slices';
import createTransactionSlice from '@/features/home/module/transaction/slices/createTransactionSlice';
import transactionDataSlice from '@/features/home/module/transaction/slices/transactionSlice';
import walletSlice from '@/features/home/module/wallet/slices';
import landingSlices from '@/features/landing/slices';
import { profileApi } from '@/features/profile/store/api/profileApi';
import flexiInterestCronjobSlice from '@/features/setting/module/cron-job/module/flexi-interest/presentation/slices';
import membershipCronjobSlice from '@/features/setting/module/cron-job/module/membership/slices';
import landingSettingSlice from '@/features/setting/module/landing/slices';
import memberShipSettingsSlice from '@/features/setting/module/membership/slices';
import notificationDashboardSlice from '@/features/setting/module/notification-dashboard/slices';
import packageFxSlice from '@/features/setting/module/packagefx/slices';
import partnerManagementSlice from '@/features/setting/module/partner/slices';
import productManagementSlice from '@/features/setting/module/product/slices';
import walletSettingSlice from '@/features/setting/module/wallet/slices';
import { combineReducers } from '@reduxjs/toolkit';
import faqsImportSlice from '../features/helps-center/store/slices/faqsImportSlice';
import budgetDetailSlice from './slices/budget-detail.slice';
import dialogSlices from './slices/dialog.slice';
import moduleReducer from './slices/moduleSlice';
import settingSlices from './slices/setting.slice';
import userSlices from './slices/user.slice';

const reducer = {
  user: userSlices,
  settings: settingSlices,
  dialog: dialogSlices,
  landing: landingSlices,
  landingSettings: landingSettingSlice,
  budgetControl: budgetControlSlice,
  budgetSummary: budgetSummarySlice,
  productManagement: productManagementSlice,
  category: categorySlice,
  packageFx: packageFxSlice,
  account: accountSlice,
  partner: partnerManagementSlice,
  transaction: transactionSlice,
  transactionData: transactionDataSlice,
  createTransaction: createTransactionSlice,
  module: moduleReducer,
  financeControl: financeControlSlice,
  memberShipSettings: memberShipSettingsSlice,
  membership: membershipSlice,
  wallet: walletSlice,
  walletSetting: walletSettingSlice,
  faqsImport: faqsImportSlice,
  budgetDetail: budgetDetailSlice,
  notificationDashboard: notificationDashboardSlice,
  membershipCronjob: membershipCronjobSlice,
  flexiInterestCronjob: flexiInterestCronjobSlice,

  // RTK Query API slices
  [helpsCenterApi.reducerPath]: helpsCenterApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
};

const rootReducer = combineReducers(reducer);

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
