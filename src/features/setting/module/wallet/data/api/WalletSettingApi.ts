import { decorate, inject, injectable } from 'inversify';
import { IWalletSettingApi } from './IWalletSettingApi';
import type { IHttpClient } from '@/config';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestStatus } from '../../domain/enum';
import { DepositRequestResponse } from '../dto/response/DepositRequestResponse';
import { routeConfig } from '@/shared/utils/route';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';

export class WalletSettingApi implements IWalletSettingApi {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async getDepositRequestsPaginated(
    userId: string,
    status: DepositRequestStatus,
    page: number,
    pageSize: number,
  ): Promise<DepositRequestResponse> {
    return this.httpClient.get(
      routeConfig(ApiEndpointEnum.WalletSetting, {}, { userId, status, page, pageSize }),
    );
  }
}

// Apply decorators programmatically
decorate(injectable(), WalletSettingApi);
decorate(inject(WALLET_SETTING_TYPES.IHttpClient), WalletSettingApi, 0);

// Create a factory function
export const createWalletSettingApi = (httpClient: IHttpClient): IWalletSettingApi => {
  return new WalletSettingApi(httpClient);
};
