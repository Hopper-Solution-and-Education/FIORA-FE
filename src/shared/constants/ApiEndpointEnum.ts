export enum ApiEndpointEnum {
  BudgetYears = '/api/budgets/dashboard',
  BudgetCategories = '/api/budgets/categories',
  BudgetActualPlanningSumUp = '/api/categories/sum-up/{categoryId}',
  BudgetTopDownUpdate = '/api/budgets/summary/update',
  BudgetByType = '/api/budgets/summary',

  CategoriesByType = '/api/categories',

  // Wallet
  Wallet = '/api/wallet',
  WalletPackage = '/api/wallet/package',
  WalletDeposit = '/api/wallet/deposit',
  WalletFrozenAmount = '/api/wallet/deposit/frozen-amount',
  WalletSetting = '/api/wallet/setting',

  // Notification
  Notification = '/api/notification',
  NotificationFilterOptions = '/api/notification/options',
}
