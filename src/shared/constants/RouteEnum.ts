export enum RouteEnum {
  Budgets = '/budgets',
  BudgetSummary = '/budgets/summary/{year}',
  BudgetDetail = '/budgets/summary/detail/{year}',
  BudgetUpdate = '/budgets/summary/update/{year}',

  WalletDashboard = '/wallet',
  WalletDeposit = '/wallet/deposit',
  DepositFX = '/setting/wallet',

  // Notification
  NotificationDashboard = '/setting/notification',
  NotificationDetail = '/setting/notification/details/{id}',

  // Cronjob dashboard
  CronjobMembership = '/setting/cron-job/membership',
  CronjobSavingInterest = '/setting/cron-job/saving-interest',
  CronjobReferral = '/setting/cron-job/referral',
  UserNotificationDetail = '/notification/details/{id}',
  FlexiInterest = '/setting/cron-job/flexi-interest',
}
