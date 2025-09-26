import type {
  IReferralRepository,
  ListInvitesParams,
} from '../../domain/repositories/referralRepository.interface';
import { referralRepository } from '../../infrastructure/repositories/referralRepository';
import type { TransactionFilters } from '../../types';

class ReferralUseCase {
  constructor(private _repo: IReferralRepository = referralRepository) {}

  getDashboardSummary(userId: string) {
    return this._repo.getDashboardSummary(userId);
  }

  listInvites(params: ListInvitesParams) {
    return this._repo.listInvites(params);
  }

  inviteByEmails(userId: string, emails: string[], createdBy?: string | null) {
    return this._repo.inviteByEmails(userId, emails, createdBy);
  }

  getWalletTransactions(userId: string, limit?: number, filters?: TransactionFilters) {
    return this._repo.getWalletTransactions(userId, limit, filters);
  }

  getWalletTransactionsPaginated(
    userId: string,
    page: number,
    pageSize: number,
    filters?: TransactionFilters,
  ) {
    return this._repo.getWalletTransactionsPaginated(userId, page, pageSize, filters);
  }

  withdraw(userId: string, amount: number, options?: { minThreshold?: number }) {
    return this._repo.withdraw(userId, amount, options);
  }
}

export const referralUseCase = new ReferralUseCase();
