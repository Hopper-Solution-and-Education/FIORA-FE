export enum ApiEndpointEnum {
  // Auth
  Login = '/api/auth/sign-in',
  SignUp = '/api/auth/sign-up',
  SignOut = '/api/auth/sign-out',
  Refresh = '/api/auth/refresh',

  // User
  Me = '/api/users/me',

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
  NotificationPersonalUpdate = '/api/notification/user',

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
  ProfileByUserId = '/api/profile/user',
  ProfileChangeEmail = '/api/profile/change-email',
  ProfileChangePhone = '/api/profile/change-phone',
  ProfileChangePassword = '/api/profile/change-password',
  ProfileDelete = '/api/profile/delete',
  ProfileSendOTP = '/api/profile/send-otp',
  ProfileVerifyReferralCode = '/api/profile/verify-referral-code',

  // eKYC
  eKYC = '/api/eKyc',
  eKYCByUserId = '/api/eKyc/user',
  eKYCVerify = '/api/eKyc/verify',
  eKYCContactVerifyOTP = '/api/eKyc/contact-information/verify',
  eKYCSendOTP = '/api/eKyc/contact-information/send-otp',

  // Identification Document
  IdentificationDocument = '/api/indentification-document',
  IdentificationDocumentByUserId = '/api/indentification-document/user',

  // Bank Account
  BankAccount = '/api/bank-account',
  BankAccountByUserId = '/api/bank-account/user',

  // Attachment
  Attachment = '/api/attachment',

  // News
  News = '/api/news',
  NewsCategories = '/api/news/categories?type=NEWS',
  NewsReaction = '/api/news/react',

  //Sending FX
  SendingWalletRecommendReceiver = '/api/sending-wallet/recommend-reciever',
  SendingSendOTP = '/api/sending-wallet/send-otp',
  SendingWalletSendFX = '/api/sending-wallet/send-fx',
  SendingWalletAmountLimit = '/api/sending-wallet/amount-limit',
  SendingCatalog = '/api/sending-wallet/catalog',

  // Withdraw FX
  walletWithdraw = '/api/wallet/withdraw',
  getOtp = '/api/wallet/withdraw/sendOtp',

  // Wallet Smart Saving
  SavingOverview = '/api/wallet/smart-saving/{id}',
  SavingTransactionHistory = '/api/wallet/smart-saving/transaction',
  SavingTransfer = '/api/wallet/smart-saving/transfer',
  SavingClaim = '/api/wallet/smart-saving/claims',

  // Landing Page / Banners
  BannerSections = '/api/banners/sections',
  BannerSection = '/api/banner/section',
  BannerAnnouncements = '/api/banners/announcements',
  BannerAnnouncement = '/api/banners/announcement',

  // Auth
  SendOtpForgotPassword = '/api/auth/send-otp',
  ResetPassword = '/api/auth/forgot-password',
}

export const BASE_API: string = process.env.NEXT_PUBLIC_BASE_API || '';
