import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { decorate, inject, injectable } from 'inversify';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { IWalletSettingApi } from './IWalletSettingApi';
import { _PaginationResponse, HttpResponse } from '@/shared/types';
import { GetDepositRequestResponse } from '../dto/response/GetDepositRequestResponse';
import { DepositRequestStatus } from '../../domain';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';

export class WalletSettingApi implements IWalletSettingApi {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async getDepositRequestsPaginated(
    page: number,
    pageSize: number,
  ): Promise<_PaginationResponse<GetDepositRequestResponse>> {
    return this.httpClient.get(routeConfig(ApiEndpointEnum.WalletSetting, {}, { page, pageSize }));
  }

  async updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
  ): Promise<HttpResponse<UpdateDepositRequestStatusResponse>> {
    return this.httpClient.put(routeConfig(ApiEndpointEnum.WalletSetting), {
      id,
      status,
    });
  }
}

// Apply decorators programmatically
decorate(injectable(), WalletSettingApi);
decorate(inject(WALLET_SETTING_TYPES.IHttpClient), WalletSettingApi, 0);

// Create a factory function
export const createWalletSettingApi = (httpClient: IHttpClient): IWalletSettingApi => {
  return new WalletSettingApi(httpClient);
};
