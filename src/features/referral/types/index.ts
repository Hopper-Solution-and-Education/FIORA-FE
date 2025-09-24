import { TransactionMembershipBenefit } from '@/features/home/module/transaction/types';

export interface ReferralStats {
  totalInvited: number;
  registered: number;
  eKycCompleted: number;
}

export interface ReferralUser {
  id: string;
  email: string;
  status: 'INVITED' | 'REGISTERED' | 'COMPLETED';
  joinedAt: string;
  eKycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface ReferralUsersResponse {
  data: ReferralUser[];
  total: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  status?: 'INVITED' | 'REGISTERED' | 'COMPLETED';
  eKycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  search?: string;
}

export interface GetReferralUsersParams extends PaginationParams, FilterParams {}

// Dashboard summary (server numbers)
export interface ReferralDashboardSummary {
  totalEarned: number;
  totalWithdrawn: number;
  availableBalance: number;
  referralCode?: string | null;
}

// UI-facing aggregates
export interface ReferralEarnings {
  totalEarned: string;
  totalClaims: string;
  remainingBalance: string;
  referralCode?: string | null;
}

// UI-facing transaction item
export interface ReferralTransaction {
  id: string;
  date: string;
  type: 'Income' | 'Transfer';
  amount: string;
  from: string;
  to: string;
  remark: string;
  membershipBenefit?: TransactionMembershipBenefit | null;
}

// Admin setting (server-side)
export interface ReferralSetting {
  id: string;
  bonusFirstAmount: number | string;
  minimumWithdrawal: number | string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

// Transaction filters for API
export interface TransactionFilters {
  type?: string[];
  search?: string;
  fromDate?: Date;
  toDate?: Date;
}

// Paginated transaction response
export interface PaginatedTransactionResponse {
  items: any[]; // Raw transaction data from database
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Common API response wrapper
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// Generic paginated payload used by server
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
