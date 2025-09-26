import { httpClient } from '@/config';
import { routeConfig } from '@/shared/utils/route';
import { ApiEndpointEnum } from '../ApiEndpointEnum';
import { CreateSavingHistoryRequest } from '../tdo/request/CreateSavingHistoryRequest';
import { SavingHistoryResponse } from '../tdo/response/SavingHistoryResponse';
import { SavingOverviewResponse } from '../tdo/response/SavingOverviewResponse';
import { ISavingApi } from './ISavingApi';

export class SavingApi implements ISavingApi {
  async getSavingWalletOverview(id: string): Promise<SavingOverviewResponse> {
    return await httpClient.get<SavingOverviewResponse>(
      routeConfig(ApiEndpointEnum.SavingOverview, { id }, {}),
    );
  }

  async getSavingTransactionHistory(
    filter: CreateSavingHistoryRequest,
  ): Promise<SavingHistoryResponse> {
    return await httpClient.post<SavingHistoryResponse>(
      ApiEndpointEnum.SavingTransactionHistory,
      filter,
    );
  }
}
