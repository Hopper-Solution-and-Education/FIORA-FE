import { CreateSavingHistoryRequest } from '../tdo/request/CreateSavingHistoryRequest';
import { SavingHistoryResponse } from '../tdo/response/SavingHistoryResponse';
import { SavingOverviewResponse } from '../tdo/response/SavingOverviewResponse';

export interface ISavingApi {
  getSavingWalletOverview(id: string): Promise<SavingOverviewResponse>;
  getSavingTransactionHistory(filter: CreateSavingHistoryRequest): Promise<SavingHistoryResponse>;
}
