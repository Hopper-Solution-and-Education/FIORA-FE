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

  // Cronjob Dashboard Membership
  CronjobDashboard = '/api/dashboard',
  CronjobDashboardDefineType = '/api/dashboard/define-type',
  CronjobChart = '/api/dashboard/membership-chart',
  CronjobResend = '/api/dashboard/{id}',

  // Membership
  MembershipTiers = '/api/memberships/benefit-tier',
  Users = '/api/users',

  // Cronjob Dashboard Saving Interest
  CronjobDashboardSavingInterest = '/api/dashboard/saving-interest',
  CronjobChartSavingInterest = '/api/dashboard/saving-interest-chart',

  // Cronjob Dashboard Referral
  CronjobDashboardReferral = '/api/dashboard/referral',
  CronjobChartReferral = '/api/dashboard/referral/referral-chart',

  // Notification
  Notification = '/api/notification',
  NotificationFilterOptions = '/api/notification/options',
  NotificationPersonal = '/api/notification/personal',

  // Helps Center
  HelpsCenterFaqs = '/api/helps-center/faqs',
  HelpsCenterFaqsCategories = '/api/helps-center/faqs/categories',
  HelpsCenterFaqsCategoriesWithPost = '/api/helps-center/faqs/categories/with-post',
  HelpsCenterFaqsImport = '/api/helps-center/faqs/import',
  HelpsCenterFaqsParseValidate = '/api/helps-center/faqs/parse-validate',
  HelpsCenterAboutUs = '/api/helps-center/about-us',
  HelpsCenterUserTutorial = '/api/helps-center/user-tutorial',
  HelpsCenterContactUs = '/api/helps-center/contact-us',
  HelpsCenterTermsAndConditions = '/api/helps-center/terms-and-conditions',

  // Profile
  Profile = '/api/profile',
  eKYC = '/api/eKyc',
  verifyOTP = '/api/eKyc/contact-information/verify',
  sendOTP = '/api/eKyc/contact-information/send-otp',

  // News
  News = '/api/news',
  NewsCategories = '/api/news/categories?type=NEWS',
  NewsReaction = '/api/news/react',
  // Identification Document
  IdentificationDocument = '/api/indentification-document',
  // Bank Account
  BankAccount = '/api/bank-account',

  // Withdraw FX
  walletWithdraw = '/api/wallet/withdraw',
  getOtp = '/api/wallet/withdraw/sendOtp',

  // Wallet Smart Saving
  SavingOverview = '/api/wallet/smart-saving/{id}',
  SavingTransactionHistory = '/api/wallet/smart-saving/transaction',
  SavingTransfer = '/api/wallet/smart-saving/transfer',
  SavingClaim = '/api/wallet/smart-saving/claims',
}
