import { httpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { CreateSavingClaimRequest } from '../tdo/request/CreateSavingClaimRequest';
import { CreateSavingHistoryRequest } from '../tdo/request/CreateSavingHistoryRequest';
import { CreateSavingTransferRequest } from '../tdo/request/CreateSavingTransferRequest';
import { SavingHistoryResponse } from '../tdo/response/SavingHistoryResponse';
import { SavingOverviewResponse } from '../tdo/response/SavingOverviewResponse';
import { SavingTransactionResponse } from '../tdo/response/SavingTransactionResponse';
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

  async createSavingTransfer(
    request: CreateSavingTransferRequest,
  ): Promise<SavingTransactionResponse> {
    return await httpClient.post<SavingTransactionResponse>(
      ApiEndpointEnum.SavingTransfer,
      request,
    );
  }

  async createSavingClaim(request: CreateSavingClaimRequest): Promise<SavingTransactionResponse> {
    return await httpClient.post<SavingTransactionResponse>(ApiEndpointEnum.SavingClaim, request);
  }
}
