import type { Prisma, Referral, Transaction, Wallet } from '@prisma/client';
import type {
  PaginatedTransactionResponse,
  ReferralDashboardSummary,
  TransactionFilters,
} from '../../types';

export interface ListInvitesParams {
  userId: string;
  status?: Prisma.ReferralWhereInput['status'];
  emailSearch?: string;
  page?: number;
  pageSize?: number;
}

export interface ListInvitesResult {
  items: Referral[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IReferralRepository {
  getDashboardSummary(userId: string): Promise<ReferralDashboardSummary>;
  listInvites(params: ListInvitesParams): Promise<ListInvitesResult>;
  inviteByEmails(
    userId: string,
    emails: string[],
    createdBy?: string | null,
  ): Promise<{ created: Referral[]; duplicates: string[] }>;
  getWalletTransactions(
    userId: string,
    limit?: number,
    filters?: TransactionFilters,
  ): Promise<Transaction[]>;
  getWalletTransactionsPaginated(
    userId: string,
    page: number,
    pageSize: number,
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactionResponse>;
  withdraw(
    userId: string,
    amount: number,
    options?: { minThreshold?: number },
  ): Promise<{ fromWallet: Wallet; toWallet: Wallet }>;
}

export const createReferralRepository: (
  deps?: Partial<{ prisma: any }>,
) => IReferralRepository = () => {
  // Implemented in infrastructure layer
  throw new Error('Not implemented');
};
