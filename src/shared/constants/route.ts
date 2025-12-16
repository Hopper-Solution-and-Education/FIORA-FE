export enum RouteEnum {
  SignIn = '/auth/sign-in',
  SignUp = '/auth/sign-up',
  ForgotPassword = '/auth/sign-in/forgot-password',

  Budgets = '/budgets',
  BudgetSummary = '/budgets/summary/{year}',
  BudgetDetail = '/budgets/summary/detail/{year}',
  BudgetUpdate = '/budgets/summary/update/{year}',

  WalletDashboard = '/wallet',
  WalletDeposit = '/wallet/deposit',
  WalletPayment = '/wallet/payment',
  DepositFX = '/setting/wallet',
  WalletSaving = '/wallet/saving',
  WalletReferral = '/wallet/referral',

  // Membership
  Membership = '/membership',

  // Notification
  NotificationDashboard = '/setting/notification',
  NotificationDetail = '/setting/notification/details/{id}',

  // Cronjob dashboard
  CronjobMembership = '/setting/cron-job/membership',
  CronjobSavingInterest = '/setting/cron-job/saving-interest',
  CronjobReferral = '/setting/cron-job/referral',
  UserNotificationDetail = '/notification/details/{id}',
  FlexiInterest = '/setting/cron-job/flexi-interest',

  // News & Helps
  News = '/news',
  HelpsCenter = '/helps-center',
}
