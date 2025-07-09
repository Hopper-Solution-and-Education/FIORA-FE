import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { _PaginationResponse, HttpResponse } from '@/shared/types';
import { FilterObject } from '@/shared/types/filter.types';
import { routeConfig } from '@/shared/utils/route';
import { decorate, inject, injectable } from 'inversify';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestStatus } from '../../domain';
import { GetDepositRequestResponse } from '../dto/response/GetDepositRequestResponse';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';
import { IWalletSettingApi } from './IWalletSettingApi';

export class WalletSettingApi implements IWalletSettingApi {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async getDepositRequestsPaginated(
    page: number,
    pageSize: number,
    filter?: FilterObject,
  ): Promise<_PaginationResponse<GetDepositRequestResponse>> {
    return this.httpClient.post(routeConfig(ApiEndpointEnum.WalletSetting), {
      page,
      pageSize,
      filter,
    });
  }

  async updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
    remark?: string,
  ): Promise<HttpResponse<UpdateDepositRequestStatusResponse>> {
    return this.httpClient.put(routeConfig(ApiEndpointEnum.WalletSetting), {
      id,
      status,
      ...(remark ? { remark } : {}),
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
