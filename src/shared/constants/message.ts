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
  // Category type is invalid. It must be Expense or Income

  // Product
  GET_ALL_PRODUCT_SUCCESS = 'Get all product successfully',
  CREATE_PRODUCT_SUCCESS = 'Create product successfully',
  UPDATE_PRODUCT_SUCCESS = 'Update product successfully',
  DELETE_PRODUCT_SUCCESS = 'Delete product successfully',
  GET_PRODUCT_BY_ID_SUCCESS = 'Get product by id successfully',

  // Product Failed
  CREATE_PRODUCT_FAILED = 'Failed to create product',
  UPDATE_PRODUCT_FAILED = 'Failed to update product',
  DELETE_PRODUCT_FAILED = 'Failed to delete product',
  GET_PRODUCT_FAILED = 'Failed to get product',
  INVALID_PRODUCT_TYPE = 'Invalid product type. Must be either Product or Service',

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
  CREATE_BUDGET_SUCCESS = 'Create budget successfully',
  UPDATE_BUDGET_SUCCESS = 'Update budget successfully',

  // Budget Service Failed
  INVALID_BUDGET_TYPE = 'Invalid budget type. Budget type must be Act, Bot, or Top',
  DUPLICATED_BUDGET_FISCAL_YEAR = 'Fiscal year already exists',
  BUDGET_DETAILS_CREATE_FAILED = 'Failed to create budget details',
  BUDGET_CREATE_FAILED = 'Failed to create budget',
  BUDGET_NOT_FOUND = 'Budget not found',
  BUDGET_DETAILS_NOT_FOUND = 'Budget details not found',

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

  // Account
  CREATE_ACCOUNT_FAILED = 'Failed to create account',
  CREATE_ACCOUNT_SUCCESS = 'Account created successfully',
  UPDATE_ACCOUNT_SUCCESS = 'Account updated successfully',
  DELETE_ACCOUNT_SUCCESS = 'Account deleted successfully',
  GET_ACCOUNT_SUCCESS = 'Get account list successfully',

  // General errors
  INTERNAL_ERROR = 'An error occurred, please try again later',

  // Transaction-related errors
  CREATE_TRANSACTION_FAILED = 'Failed to create transaction',
  TRANSACTION_NOT_FOUND = 'Transaction not found',
  UPDATE_TRANSACTION_FAILED = 'Failed to update transaction',
  TRANSACTION_TOO_OLD_TO_DELETE = 'Cannot delete a transaction older than 30 days',

  // Account-related errors
  ACCOUNT_NOT_FOUND = 'Account not found',
  INVALID_ACCOUNT_TYPE_FOR_INCOME = 'Invalid account type. Only Payment accounts are allowed for income.',
  UNSUPPORTED_ACCOUNT_TYPE = 'Unsupported account type',
  INVALID_ACCOUNT_TYPE_FOR_EXPENSE = 'Invalid account type. Only Payment and CreditCard are supported.',
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
  CREATE_PARTNER_SUCCESS = 'Create partner successfully.',
  UPDATE_PARTNER_SUCCESS = 'Update partner successfully.',
  DELETE_PARTNER_SUCCESS = 'Delete partner successfully.',
  CREATE_PARTNER_FAILED = 'Failed to create partner.',
  UPDATE_PARTNER_FAILED = 'Failed to update partner.',

  INVALID_USER = 'Invalid user.',
  USER_EMAIL_EXISTED = 'Email already existed',
  NOT_FOUND_EMAIL = 'User email not found',
  INVALID_PHONE = 'Invalid phone number.',
  INVALID_DOB = 'Invalid date of birth.',

  // COMMON ERRORS
  INVALID_CURRENCY = 'Invalid currency. Must be either VND or USD.',
  VALIDATION_ERROR = 'Validation error.',
}
