import { AccountType } from './index';

/**
 * DTO for creating a new account
 * Matches backend CreateAccountDto
 */
export interface CreateAccountDto {
  name: string;
  type: AccountType;
  description?: string;
  icon?: string;
  currencyId?: string;
  currency?: string;
  balance?: number;
  limit?: number;
  parentId?: string | null;
  baseAmount?: number;
  baseCurrency?: string;
}

/**
 * DTO for updating an existing account
 * Matches backend UpdateAccountDto
 */
export interface UpdateAccountDto {
  name?: string;
  description?: string;
  icon?: string;
  currencyId?: string;
  currency?: string;
  parentId?: string | null;
  type?: AccountType;
  color?: string | null;
  balance?: number;
  limit?: number;
  baseAmount?: number;
  baseCurrency?: string;
}

/**
 * DTO for searching accounts
 * Matches backend SearchAccountDto
 */
export interface SearchAccountDto {
  page?: number;
  size?: number;
  search?: string;
  minBalance?: number;
  maxBalance?: number;
  type?: AccountType;
  isParent?: boolean;
  filters?: any;
}

/**
 * DTO for deleting sub-account
 * Matches backend DeleteSubAccountDto
 */
export interface DeleteSubAccountDto {
  parentId: string;
  subAccountId: string;
}

/**
 * Response structure from backend
 */
export interface ApiResponse<T> {
  message?: string;
  data: T;
  success?: boolean;
}
