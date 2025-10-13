import { CreateSavingClaimRequest } from '../tdo/request/CreateSavingClaimRequest';
import { CreateSavingHistoryRequest } from '../tdo/request/CreateSavingHistoryRequest';
import { CreateSavingTransferRequest } from '../tdo/request/CreateSavingTransferRequest';
import { SavingHistoryResponse } from '../tdo/response/SavingHistoryResponse';
import { SavingOverviewResponse } from '../tdo/response/SavingOverviewResponse';
import { SavingTransactionResponse } from '../tdo/response/SavingTransactionResponse';

export interface ISavingApi {
  getSavingWalletOverview(id: string): Promise<SavingOverviewResponse>;
  getSavingTransactionHistory(filter: CreateSavingHistoryRequest): Promise<SavingHistoryResponse>;
  createSavingTransfer(request: CreateSavingTransferRequest): Promise<SavingTransactionResponse>;
  createSavingClaim(request: CreateSavingClaimRequest): Promise<SavingTransactionResponse>;
}
