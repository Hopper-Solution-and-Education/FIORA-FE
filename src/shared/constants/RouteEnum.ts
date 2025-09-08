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
  UserNotificationDetail = '/notification/details/{id}',
}
