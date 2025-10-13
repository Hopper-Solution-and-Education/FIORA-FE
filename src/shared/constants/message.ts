export enum Messages {
  // Transaction
  GET_TRANSACTION_SUCCESS = 'Get transaction list successfully',
  GET_TRANSACTION_BY_ID_SUCCESS = 'Get transaction by id successfully',
  GET_FILTER_OPTIONS_SUCCESS = 'Get transaction filter options successfully',
  CREATE_TRANSACTION_SUCCESS = 'Create transaction successfully',
  UPDATE_TRANSACTION_SUCCESS = 'Update transaction successfully',
  DELETE_TRANSACTION_SUCCESS = 'Delete transaction successfully',
  INVALID_TRANSACTION_TYPE = 'Invalid transaction type',

  // Category
  CREATE_CATEGORY_SUCCESS = 'Create category successfully',
  UPDATE_CATEGORY_SUCCESS = 'Update category successfully',
  DELETE_CATEGORY_SUCCESS = 'Delete category successfully',
  GET_CATEGORY_SUCCESS = 'Get category successfully',
  CATEGORY_TYPE_MISMATCH = 'Category type is invalid. Ensure the category type matches the given type.',
  // Category type is invalid. It must be Expense or Income

  // Product
  GET_ALL_PRODUCT_SUCCESS = 'Get all product successfully',
  CREATE_PRODUCT_SUCCESS = 'Create product successfully',
  UPDATE_PRODUCT_SUCCESS = 'Update product successfully',
  DELETE_PRODUCT_SUCCESS = 'Delete product successfully',
  DUPLICATE_PRODUCT_TENANT_ERROR = 'Product with the same name and category already exists',
  GET_PRODUCT_BY_ID_SUCCESS = 'Get product by id successfully',
  GET_PRODUCT_FILTERS = 'Get product filtered successfully.',
  DUPLICATE_PRODUCT_NAME_ERROR = 'Product with the same name already exists',

  // Product Failed
  CREATE_PRODUCT_FAILED = 'Failed to create product',
  UPDATE_PRODUCT_FAILED = 'Failed to update product',
  DELETE_PRODUCT_FAILED = 'Failed to delete product',
  GET_PRODUCT_FAILED = 'Failed to get product',
  INVALID_PRODUCT_TYPE = 'Invalid product type. Must be either Product or Service or Edu',

  // Product & Service
  TRANSFER_TRANSACTION_SUCCESS = 'Transfer transaction successfully',

  // Product Items
  CREATE_PRODUCT_ITEM_SUCCESS = 'Create product item successfully',
  UPDATE_PRODUCT_ITEM_SUCCESS = 'Update product item successfully',
  DELETE_PRODUCT_ITEM_SUCCESS = 'Delete product item successfully',
  GET_PRODUCT_ITEM_SUCCESS = 'Get product item successfully',

  // Product Items Failed
  CREATE_PRODUCT_ITEM_FAILED = 'Failed to create product item',
  UPDATE_PRODUCT_ITEM_FAILED = 'Failed to update product item',

  // Budget Service
  GET_BUDGET_ITEM_SUCCESS = 'Get budget item successfully',
  GET_BUDGET_LIST_FISCAL_YEAR_SUCCESS = 'Get budget list fiscal year successfully',
  CREATE_BUDGET_SUCCESS = 'Create budget successfully',
  UPDATE_BUDGET_SUCCESS = 'Update budget successfully',
  BUDGET_PAST_YEAR_NOT_ALLOWED = 'Fiscal year cannot be in the past',
  BUDGET_DELETE_SUCCESS = 'Budget deleted successfully',
  BUDGET_GET_BY_ID_SUCCESS = 'Get budget by id successfully',
  BUDGET_UPDATE_SUCCESS = 'Update budget successfully !',
  BUDGET_DETAIL_CREATE_SUCCESS = 'Create budget details successfully',

  TO_DATE_BEFORE_FROM_DATE = 'To date must be after from date',
  INVALID_DATE_FORMAT = 'Invalid date format',
  INVALID_DATE_RANGE_INPUT = 'Invalid date range input',
  INVALID_DATE_RANGE_INPUT_30_DAYS = 'Invalid date range input. Date range must be within 30 days from now',

  // Budget Service Failed
  BUDGET_ID_MISSING = 'Budget id is missing',
  INVALID_BUDGET_TYPE = 'Invalid budget type. Budget type must be Act, Bot, or Top',
  DUPLICATED_BUDGET_FISCAL_YEAR = 'Fiscal year already exists',
  BUDGET_DETAILS_CREATE_FAILED = 'Failed to create budget details',
  BUDGET_CREATE_FAILED = 'Failed to create budget',
  BUDGET_NOT_FOUND = 'Budget not found',
  BUDGET_DETAILS_NOT_FOUND = 'Budget details not found',
  BUDGET_UPDATE_FAILED = 'Failed to update budget',
  BUDGET_DELETE_FAILED = 'Failed to delete budget',
  BUDGET_FISCAL_YEAR_ALREADY_EXISTS = 'Budget fiscal year already exists',
  BUDGET_DETAILS_TO_DELETE_NOT_FOUND = 'Budget details to delete not found',
  BUDGET_DETAILS_TO_DELETE_NOT_FOUND_CODE = 'BDNF',

  // Budget Details Service Success
  BUDGET_DETAIL_CREATED_SUCCESS = 'Budget details created successfully',
  BUDGET_DETAIL_UPDATED_SUCCESS = 'Budget details updated successfully',
  BUDGET_DETAIL_DELETED_SUCCESS = 'Budget details deleted successfully',

  // Budget Details Service Failed
  BUDGET_DETAIL_UPDATE_FAILED = 'Failed to update budget details',
  BUDGET_DETAIL_UPDATE_MANY_FAILED = 'Failed to update many budget details',
  BUDGET_DETAIL_DELETE_FAILED = 'Failed to delete budget details',
  DUPLICATED_CATEGORY_BUDGET_DETAILS = 'Category already exists in budget details',

  // Category-Product Success
  CREATE_CATEGORY_PRODUCT_SUCCESS = 'Create category product successfully',
  UPDATE_CATEGORY_PRODUCT_SUCCESS = 'Update category product successfully',
  DELETE_CATEGORY_PRODUCT_SUCCESS = 'Delete category product successfully',
  GET_CATEGORY_PRODUCT_SUCCESS = 'Get list category product successfully',
  GET_DETAIL_CATEGORY_PRODUCT_SUCCESS = 'Get detail category product successfully',
  CATEGORY_PRODUCT_STILL_HAS_PRODUCTS = 'Category product still has products',

  // Category-Product Failed
  CATEGORY_PRODUCT_NOT_FOUND = 'Category product not found',
  CREATE_CATEGORY_PRODUCT_FAILED = 'Failed to create category product',
  UPDATE_CATEGORY_PRODUCT_FAILED = 'Failed to update category product',
  UPDATE_CATEGORY_PRODUCT_MANY_FAILED = 'Failed to update many category product',
  DELETE_CATEGORY_PRODUCT_FAILED = 'Failed to delete category product',
  GET_CATEGORY_PRODUCT_FAILED = 'Failed to get category product',
  CATEGORY_PRODUCT_NAME_EXIST = 'Category product name already exists',
  // Account
  CREATE_ACCOUNT_FAILED = 'Failed to create account',
  CREATE_ACCOUNT_SUCCESS = 'Account created successfully',
  GET_ACCOUNT_FILTERED_SUCCESS = 'Get account filtered successfully.',
  UPDATE_ACCOUNT_SUCCESS = 'Account updated successfully',
  DELETE_ACCOUNT_SUCCESS = 'Account deleted successfully',
  GET_ACCOUNT_SUCCESS = 'Get account list successfully',

  // General errors
  INTERNAL_ERROR = 'An error occurred, please try again later',

  // Transaction-related errors
  CREATE_TRANSACTION_FAILED = 'Failed to create transaction',
  TRANSACTION_NOT_FOUND = 'Transaction not found',
  TRANSACTION_WALLET_NOT_FOUND = 'Transaction wallet not found',
  UPDATE_TRANSACTION_FAILED = 'Failed to update transaction',
  TRANSACTION_TOO_OLD_TO_DELETE = 'Cannot delete a transaction older than 30 days',

  // Account-related errors
  ACCOUNT_NOT_FOUND = 'Account not found',
  INVALID_ACCOUNT_TYPE_FOR_INCOME = 'Invalid account type. Only Payment accounts are allowed for income.',
  UNSUPPORTED_ACCOUNT_TYPE = 'Unsupported account type',
  INVALID_ACCOUNT_TYPE_FOR_EXPENSE = 'Invalid account type. Only Payment and CreditCard are supported.',
  REMARK_IS_REQUIRED = 'Remark is required',
  MASTER_ACCOUNT_ALREADY_EXISTS = 'Master account already exists! You can only have one master account.',
  UNAUTHORIZED = 'Not logged in',
  UPDATE_PARENT_ACCOUNT_NOT_ALLOWED = 'Parent account balance cannot be updated',

  // Category-related errors
  CATEGORY_NOT_FOUND = 'Category not found',
  INVALID_CATEGORY_TYPE_INCOME = 'Invalid category type. Category must be Income.',
  INVALID_CATEGORY_TYPE_EXPENSE = 'Category must be Expense.',
  PRODUCT_INVALID_CATEGORY_TYPE = 'Invalid product category type.',
  INVALID_CATEGORY_TYPE = 'Invalid category type. It must be Expense or Income.',
  INVALID_CATEGORY_REQUIRED = 'Name and icon are required',

  // Account balance-related errors
  INSUFFICIENT_BALANCE = 'Account balance must be greater than or equal to the transaction amount.',
  INSUFFICIENT_CREDIT_LIMIT = 'Credit card does not have enough available limit.',

  // Product-related errors
  PRODUCT_NOT_FOUND = 'Product not found',
  NO_PRODUCTS_PROVIDED = 'No products provided',
  TARGET_PRODUCT_NOT_FOUND = 'Target product not found',
  SOURCE_PRODUCT_NOT_FOUND = 'Source product not found',
  SOURCE_PRODUCT_TRANSFER_SELF_FAILED = 'Source product cannot be the same as target product',
  TRANSFER_TRANSACTION_FAILED = 'Failed to transfer transaction',
  // Transaction Constraint when delete
  TRANSACTION_DELETE_FAILED_CONSTRAINT = 'Transaction cannot be deleted because it is linked to transactions.',

  // System errors
  MISSING_PARAMS_INPUT = 'Missing required parameters',
  METHOD_NOT_ALLOWED = 'Method not allowed',

  // Partner validation errors
  INVALID_EMAIL = 'Invalid email',
  EMAIL_TOO_LONG = 'Email is too long (maximum 50 characters)',
  INVALID_PHONE_LENGTH = 'Phone number must be between 10 and 15 characters',
  INVALID_TAX_NO = 'Invalid tax number',
  TAX_NO_TOO_LONG = 'Tax number is too long (maximum 20 characters)',
  INVALID_IDENTIFY = 'Invalid identifier',
  IDENTIFY_TOO_LONG = 'Identifier is too long (maximum 50 characters)',
  NAME_REQUIRED = 'Name is required',
  NAME_TOO_LONG = 'Name is too long (maximum 255 characters)',
  DESCRIPTION_TOO_LONG = 'Description is too long (maximum 1000 characters)',
  ADDRESS_TOO_LONG = 'Address is too long (maximum 255 characters)',
  INVALID_LOGO_URL = 'Invalid logo URL',
  INVALID_DOB_FORMAT = 'Invalid date of birth format',
  DOB_TOO_OLD = 'Date of birth is invalid (over 150 years)',
  PARTNER_NOT_FOUND = 'Partner not found',
  PARENT_PARTNER_NOT_FOUND = 'Parent partner not found',
  PARENT_PARTNER_DIFFERENT_USER = 'Parent partner must belong to the same user',
  INVALID_PARENT_HIERARCHY = 'Invalid parent partner hierarchy',
  INVALID_PARENT_PARTNER_SELF = 'Partner cannot be its own parent',
  PARTNER_EMAIL_EXISTS = 'Email already exists',
  PARTNER_PHONE_EXISTS = 'Phone number already exists',
  PARTNER_TAXNO_EXISTS = 'Tax number already exists',
  PARTNER_IDENTIFY_EXISTS = 'Identifier already exists',

  GET_PARTNER_SUCCESS = 'Get partner list successfully.',
  GET_PARTNER_FILTERED_SUCCESS = 'Get partner filtered successfully.',
  CREATE_PARTNER_SUCCESS = 'Create partner successfully.',
  UPDATE_PARTNER_SUCCESS = 'Update partner successfully.',
  DELETE_PARTNER_SUCCESS = 'Delete partner successfully.',
  CREATE_PARTNER_FAILED = 'Failed to create partner.',
  UPDATE_PARTNER_FAILED = 'Failed to update partner.',

  // FINANCE REPORT
  GET_FINANCE_REPORT_SUCCESS = 'Get finance report successfully.',
  GET_FINANCE_REPORT_FAILED = 'Failed to get finance report.',
  INVALID_FINANCE_REPORT_TYPE = 'Invalid finance report type for {{type}}.',
  INVALID_FINANCE_REPORT_FILTER = 'Invalid finance report filter.',
  INVALID_FINANCE_REPORT_FILTER_TYPE = 'Invalid finance report filter type.',
  INVALID_FINANCE_REPORT_IDS = 'IDs must be a non-empty array',

  // Membership Tier Failed
  MEMBERSHIP_TIER_ALREADY_EXISTS = 'Membership tier already exists',
  MEMBERSHIP_TIER_CREATE_FAILED = 'Failed to create membership tier',
  MEMBERSHIP_TIER_UPDATE_FAILED = 'Failed to update membership tier',
  MEMBERSHIP_TIER_DELETE_FAILED = 'Failed to delete membership tier',
  MEMBERSHIP_TIER_NOT_FOUND = 'Membership tier not found',
  MEMBERSHIP_BENEFIT_SLUG_NAME_NOT_FOUND = 'Membership benefit slug-name not found',
  MEMBERSHIP_TIER_BENEFIT_CREATE_FAILED = 'Failed to create membership tier benefit',
  MEMBERSHIP_TIER_BENEFIT_NOT_FOUND = 'Membership tier benefit not found',
  MEMBERSHIP_BENEFIT_NOT_FOUND = 'Membership benefit not found',
  MEMBERSHIP_BENEFIT_SLUG_NAME_ALREADY_EXISTS = 'Membership benefit slug name already exists',
  // Membership Tier Dashboard
  GET_MEMBERSHIP_TIERS_DASHBOARD_SUCCESS = 'Membership tiers dashboard retrieved successfully',

  // Membership Tier Success
  UPSERT_MEMBERSHIP_TIER_SUCCESS = 'Membership tier upserted successfully',
  MEMBERSHIP_TIER_UPDATE_SUCCESS = 'Membership tier updated successfully',
  MEMBERSHIP_TIER_CREATE_SUCCESS = 'Membership tier created successfully',
  MEMBERSHIP_TIER_DELETE_SUCCESS = 'Membership tier deleted successfully',
  MEMBERSHIP_TIER_GET_SUCCESS = 'Membership tier retrieved successfully',
  MEMBERSHIP_TIER_GET_FAILED = 'Failed to retrieve membership tier',
  MEMBERSHIP_TIER_GET_ALL_SUCCESS = 'Membership tiers retrieved successfully',

  // Membership Tier Current
  GET_CURRENT_MEMBERSHIP_TIER_SUCCESS = 'Current membership tier retrieved successfully',

  // Membership Progress Failed
  MEMBERSHIP_PROGRESS_OF_CURRENT_USER_NOT_FOUND = 'Membership progress of current user not found',

  // Membership Progress Success
  MEMBERSHIP_PROGRESS_OF_CURRENT_USER_SUCCESS = 'Membership progress of current user retrieved successfully',

  // WALLET
  GET_WALLET_SUCCESS = 'Get wallet successfully.',
  GET_PACKAGE_FX_SUCCESS = 'Get package FX successfully.',
  GET_FROZEN_DEPOSIT_AMOUNT_SUCCESS = 'Get frozen deposit amount successfully.',
  GET_DEPOSIT_REQUEST_SUCCESS = 'Get deposit requests successfully.',
  CREATE_DEPOSIT_REQUEST_SUCCESS = 'Create deposit request successfully.',
  UPDATE_DEPOSIT_REQUEST_STATUS_SUCCESS = 'Update deposit request status successfully.',
  USER_WALLET_NOT_FOUND = 'User wallet not found.',

  // WALLET FAID
  INVALID_DEPOSIT_REQUEST_TYPE = 'Invalid deposit request type.',
  MISSING_REJECTION_REASON = 'Missing rejection reason.',
  INVALID_WALLET_TYPE = 'Invalid wallet type.',
  UPDATE_DEPOSIT_REQUEST_STATUS_FAILED = 'Update deposit request status failed.',
  INVALID_STATUS = 'Invalid status.',
  PAYMENT_WALLET_NOT_FOUND = 'Payment wallet not found.',
  COULD_NOT_GENERATE_UNIQUE_REF_CODE = 'Could not generate unique refCode, please try again.',
  CURRENCY_IS_REQUIRED = 'Currency is required.',

  // PACKAGE FX SUCCESS
  CREATE_PACKAGE_FX_SUCCESS = 'Create package FX successfully.',
  UPDATE_PACKAGE_FX_SUCCESS = 'Update package FX successfully.',
  DELETE_PACKAGE_FX_SUCCESS = 'Delete package FX successfully.',
  GET_PACKAGE_FX_BY_ID_SUCCESS = 'Get package FX by id successfully.',

  // PACKAGE FX FAILED
  CREATE_PACKAGE_FX_FAILED = 'Failed to create package FX.',
  UPDATE_PACKAGE_FX_FAILED = 'Failed to update package FX.',
  DELETE_PACKAGE_FX_FAILED = 'Failed to delete package FX.',
  PACKAGE_FX_NOT_FOUND = 'Package FX not found.',
  PACKAGE_FX_ID_REQUIRED = 'Package FX id is required.',
  PACKAGE_FX_FX_FAILED = 'fxAmount is requird',
  PACKAGE_FX_FX_AMOUNT_INVALID = 'fxAmount must be a non-negative number',
  PACKAGE_FX_FILE_UPLOAD_FAILED = 'Failed to upload file for package FX.',
  PACKAGE_FX_HAS_ACTIVE_DEPOSIT_REQUEST = 'Cannot update PackageFX: There are active deposit requests pending approval',

  // EXCHANGE RATE SUCCESS
  CREATE_EXCHANGE_RATE_SUCCESS = 'Create exchange rate successfully.',
  UPDATE_EXCHANGE_RATE_SUCCESS = 'Update exchange rate successfully.',
  DELETE_EXCHANGE_RATE_SUCCESS = 'Delete exchange rate successfully.',
  GET_EXCHANGE_RATE_SUCCESS = 'Get exchange rate successfully.',

  // EXCHANGE RATE FAILED
  CREATE_EXCHANGE_RATE_FAILED = 'Failed to create exchange rate.',
  GET_EXCHANGE_RATE_FAILED = 'Failed to get exchange rate.',
  INVALID_EXCHANGE_RATE_DATA = 'Invalid exchange rate data.',
  EXCHANGE_RATE_ALREADY_EXISTS = 'Exchange rate already exists.',
  EXCHANGE_RATE_DUPLICATED_FIELDS = 'Exchange rate duplicated fields.',
  UPDATE_EXCHANGE_RATE_FAILED = 'Failed to update exchange rate.',
  EXCHANGE_RATE_NOT_FOUND = 'Exchange rate not found.',
  DELETE_EXCHANGE_RATE_FAILED = 'Failed to delete exchange rate.',

  INVALID_USER = 'Invalid user.',
  USER_EMAIL_EXISTED = 'Email already existed',
  NOT_FOUND_EMAIL = 'User email not found',
  INVALID_PHONE = 'Invalid phone number.',
  INVALID_DOB = 'Invalid date of birth.',

  // CURRENCY SUCCESS
  GET_CURRENCY_SUCCESS = 'Get currency successfully.',
  CREATE_CURRENCY_SUCCESS = 'Create currency successfully.',
  // CURRENCY ERROR
  CURRENCY_NOT_FOUND = 'Currency not found',
  GET_CURRENCY_FAILED = 'Failed to get currency.',
  // FAQ
  IMPORT_FAQS_SUCCESS = 'Import FAQs successfully',
  IMPORT_FAQS_FAILED = 'Import FAQs failed',
  GET_FAQ_CATEGORIES_SUCCESS = 'Get FAQ categories successfully',
  GET_FAQ_CATEGORIES_FAILED = 'Get FAQ categories failed',
  GET_FAQ_CATEGORIES_WITH_POST_SUCCESS = 'Get FAQ categories with post successfully',
  GET_FAQ_CATEGORIES_WITH_POST_FAILED = 'Get FAQ categories with post failed',
  DELETE_COMMENT_SUCCESS = 'Delete comment successfully',
  CREATE_COMMENT_SUCCESS = 'Create comment successfully',
  CREATE_REACTION_SUCCESS = 'Create reaction successfully',
  DELETE_REACTION_SUCCESS = 'Delete reaction successfully',
  GET_FAQ_DETAIL_SUCCESS = 'Get FAQ detail successfully',
  FAQ_NOT_FOUND = 'FAQ not found',
  UPDATE_FAQ_SUCCESS = 'Update FAQ successfully',
  DELETE_FAQ_SUCCESS = 'Delete FAQ successfully',
  GET_FAQ_LIST_SUCCESS = 'Get FAQ list successfully',
  CREATE_FAQ_CATEGORY_SUCCESS = 'Create FAQ category successfully',
  CREATE_FAQ_CATEGORY_FAILED = 'Create FAQ category failed',
  COMMENT_NOT_FOUND = 'Comment not found',
  GET_FAQ_COMMENTS_SUCCESS = 'Get FAQ comments successfully',
  GET_FAQ_COMMENTS_FAILED = 'Get FAQ comments failed',
  GET_FAQ_REACTIONS_SUCCESS = 'Get FAQ reactions successfully',
  GET_FAQ_REACTIONS_FAILED = 'Get FAQ reactions failed',
  FAQ_TITLE_ALREADY_EXISTS = 'FAQ title already exists',
  CREATE_FAQ_SUCCESS = 'Create FAQ successfully',
  // COMMON ERRORS
  INVALID_CURRENCY = 'Invalid currency. Must be either VND or USD.',
  VALIDATION_ERROR = 'Validation error.',

  GET_NOTIFICATION_SUCCESS = 'Get notification list successfully.',
  NOTIFICATION_NOT_BELONG_TO_USER = 'Notification not belong to user',

  INVALID_PAGE_OR_PAGE_SIZE = 'Invalid page or pageSize.',
  INVALID_FILTER_FORMAT = 'Invalid filter format.',
  INVALID_CONTENT_TYPE_MULTIPART = 'Content-Type must be multipart/form-data',

  // Email template
  CREATE_EMAIL_TEMPLATE_SUCCESS = 'Create email template successfully',
  UPDATE_EMAIL_TEMPLATE_SUCCESS = 'Update email template successfully',
  DELETE_EMAIL_TEMPLATE_SUCCESS = 'Delete email template successfully',
  GET_EMAIL_TEMPLATE_SUCCESS = 'Get email template successfully',
  EMAIL_TEMPLATE_NOT_FOUND = 'Email template not found',
  NOT_DELETE_TEMPLATE = 'Do not delete template default',
  ID_REQUIRE = 'You must provide an ID',
  DUPLICATE_EMAIL_TEMPLATE = 'Do not duplicate email template of the same type or name',
  EMAIL_TEMPLATE_DEFAULT_EXIT = 'Email template default already exists',

  //Bank Account
  EXIT_BANK_ACCOUNT = 'Bank account already exists',
  CREATE_BANK_ACCOUNT_SUCCESS = 'Create bank account successfully',
  VERIFY_BANK_ACCOUNT_SUCCESS = 'Verify bank account successfully',
  GET_BANK_ACCOUNT_SUCCESS = 'Get bank account successfully',
  BANK_ACCOUNT_NOT_FOUND = 'BankAccount not found',

  //Identification
  IDENTIFICATION_ACCOUNT = 'Identification already exists',
  CREATE_IDENTIFICATION_SUCCESS = 'Create identification successfully',
  GET_IDENTIFICATION_SUCCESS = 'Get identification successfully',
  VERIFY_IDENTIFICATION_SUCCESS = 'Verify identification successfully',
  IDENTIFICATION_NOT_FOUND = 'Identification not found',

  //eKyc
  KYC_ACCOUNT = 'eKyc already exists',
  CREATE_KYC_SUCCESS = 'Create eKyc successfully',
  GET_KYC_SUCCESS = 'Get eKyc successfully',
  KYC_NOT_FOUND = 'Kyc not found',
  KYC_CHECK = 'Kyc is used',
  KYC_NOT_MATCH = 'Kyc not match',

  //Common
  DELETE_SUCCESS = 'Delete successfully',
  SEND_SUCCESS = 'Send successfully',
  VERIFY_SUCCESS = 'Verify successfully',
  VERIFY_EXIT = 'Verify already exists',
  GET_SUCCESS = 'Get successfully',
  UPDATE_SUCCESS = 'Update successfully',
  UPDATE_FAIL = 'Update fail!',

  //Email template type
  EMAIL_TEMPLATE_TYPE_NOT_FOUND = 'Email template type not found',

  // Smart Saving
  GET_SMART_SAVING_SUCCESS = 'Get smart saving list successfully',
  GET_SMART_SAVING_SUCCESS_OPTIONS = 'Get smart saving filter options list successfully',
  GET_SMART_SAVING_STATISTICS_SUCCESS = 'Get smart saving statistics successfully',
  UPDATE_SMART_SAVING_SUCCESS = 'Update smart saving successfully',
  SMART_SAVING_NOT_FOUND = 'Update smart saving failded',
  SMART_SAVING_AMOUNT_MUST_BE_POSITIVE = 'Smart saving amount must be a positive number',
  MISSSING_SMART_REQUEST_BODY = 'Request body is missing',
  // Flexi Interest
  GET_FLEXI_INTEREST_SUCCESS = 'Get flexi interest list successfully',
  GET_FLEXI_NO_CONTENT = 'No content found for flexi interest',
  GET_FLEXI_INTEREST_FILTEROPTION_SUCCESS = 'Get flexi interest filter options successfully',
  // Referral Chart
  GET_REFERRAL_CHART_SUCCESS = 'Get referral chart successfully',
  GET_LIST_REFERRAL_ITEMS_SUCCESS = 'Get list referral items successfully',
  GET_REFERRAL_DASHBOARD_PAYLOAD_FILTERS_SUCCESS = 'Get referral dashboard payload filters successfully',

  // Cronjob
  REFERRAL_CRONJOB_NOT_FOUND = 'Referral cronjob not found',
  UPDATE_REFERRAL_CRONJOB_SUCCESS = 'Update referral cronjob successfully',
  REFERRAL_CRONJOB_FAILED_TO_UPDATE_ALREADY_UPDATED = 'Referral cronjob failed to update since it has already been success',
  REFERRAL_CRONJOB_FAILED_TO_UPDATE = 'Referral cronjob failed to update',
  //Payment Wallet
  GET_PAYMENT_WALLET_DETAILS_SUCCESS = 'Get payment wallet details successfully',
  GET_PAYMENT_WALLET_OPTIONS_SUCCESS = 'Get payment wallet filter options successfully',
  FETCH_PAYMENT_WALLET_DASHBOARD_METRICS_SUCCESS = 'Fetch payment wallet dashboard metrics successfully',
  //News
  GET_LISTNEW_SUCCESS = 'Get list news success',
  CREATE_NEWS_SUCCESS = 'Create news successfully',
  NEWS_TITLE_ALREADY_EXISTS = 'NEWS title already exists',
  DELETE_NEWS_SUCCESS = 'Delete News successfully',
  DELETE_NEWS_ERROR = 'Delete News error',
  POST_CATEGORY_NOT_FOUND = 'POST category not found',
  GET_LIST_COMMENT_NEWS_SUCCESS = 'Get list comment news successfully',
  COMMENT_NEWS_SUCCESS = 'Comment news successfully',
  UPDATE_COMMENT_NEWS_SUCCESS = 'Update comment news successfully',
  UPDATE_COMMENT_NEWS_ERROR = 'Update comment news error',
  DELETE_COMMENT_NEWS_SUCCESS = 'Delete comment news successfully',
  REACT_NEWS_SUCCESS = 'React news successfully',
  UNREACT_NEWS_SUCCESS = 'Un react news successfully',
  GET_NEWS_DETAIL_SECCESS = 'Get news detail successfully',
  NEWS_NOT_FOUND = 'News not found',
  CREATE_COMMENT_NEWS_SUCCESS = 'Create comment news successfully',
  GET_LIST_POST_TYPE_SUCCESS = 'Get list post type successfully',
  DELETE_COMMENT_SUCESS = 'Delete news comment successfully',

  //User
  USER_NOT_FOUND = 'User not found',

  // Wallet Withdraw
  GET_WALLET_WITHDRAW_SUCCESS = 'Get wallet withdraw successfully',
  WITHDRAW_REQUEST_SUCCESS = 'Withdraw request successfully',
  WITHDRAW_REQUEST_FAILED = 'Withdraw request failed',
  INVALID_AMOUNT = 'no data',
  SEND_OTP_SUCESSFULL = 'send otp verify withdraw successfully',

  //Saving Wallet
  DEPOSIT_AMOUNT_ERROR = 'Error depositing to saving wallet',
  WITHDRAW_AMOUNT_ERROR = 'Error withdrawing from saving wallet',
  MIN_TRANSFER_AMOUNT_ERROR = 'Transfer amount must be greater than 100 FX',

  //Withdrawal Request
  ATTACHMENT_REQUIRED = 'Attachment is required to approve a withdrawal request',
}
