import type { FilterCriteria } from '@/shared/types/filter.types';

// Payment Wallet Dashboard Metrics Interface
export interface PaymentWalletDashboardMetrics {
  totalMovedIn: number;
  totalMovedOut: number;
  annualFlexInterest: number;
  totalBalance: number;
  totalAvailableBalance: number;
  totalFrozen: number;
  accumulatedEarn: number;
}

// Payment Wallet Transaction Interface (based on API response structure)
export interface PaymentWalletTransaction {
  id: string;
  amount: number;
  type: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  fromWalletId?: string;
  toWalletId?: string;
  categoryId?: string;
  // Add other transaction fields as needed based on your transaction entity
}

// Payment Wallet Pagination Response
export interface PaymentWalletPaginatedResponse {
  data: PaymentWalletTransaction[];
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    lastCursor?: string;
  };
}

// Payment Wallet Filter Parameters
export interface PaymentWalletFilterParams {
  filters?: any;
  lastCursor?: string;
  page?: number;
  pageSize: number;
  searchParams?: string;
}

// Payment Wallet Redux State
export interface PaymentWalletState {
  // Dashboard metrics
  dashboardMetrics: PaymentWalletDashboardMetrics | null;

  // Transaction data
  transactions: PaymentWalletTransaction[];

  // Loading states
  loading: boolean;
  dashboardLoading: boolean;
  transactionsLoading: boolean;

  // Error states
  error: string | null;
  dashboardError: string | null;
  transactionsError: string | null;

  // Filter and search
  filterCriteria: FilterCriteria;
  searchTerm: string | null;

  // Pagination
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    lastCursor?: string;
  } | null;

  // UI state
  pageSize: number;
}

// Initial state
export const initialPaymentWalletState: PaymentWalletState = {
  dashboardMetrics: null,
  transactions: [],
  loading: false,
  dashboardLoading: false,
  transactionsLoading: false,
  error: null,
  dashboardError: null,
  transactionsError: null,
  filterCriteria: { userId: '', filters: {}, search: '' },
  searchTerm: null,
  pagination: null,
  pageSize: 10,
};

// Request/Response types for async thunks
export interface FetchPaymentWalletDashboardRequest {
  // No additional parameters needed as userId comes from session
}

export interface FetchPaymentWalletTransactionsRequest {
  filters?: any;
  lastCursor?: string;
  page?: number;
  pageSize: number;
  searchParams?: string;
}

export interface FetchPaymentWalletDashboardSuccess {
  metrics: PaymentWalletDashboardMetrics;
}

export interface FetchPaymentWalletTransactionsSuccess {
  data: PaymentWalletPaginatedResponse;
}

export interface PaymentWalletApiError {
  error: string;
}
