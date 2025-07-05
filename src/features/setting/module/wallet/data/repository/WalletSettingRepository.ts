import { decorate, inject, injectable } from 'inversify';
import { IWalletSettingRepository } from './IWalletSettingRepository';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import type { IWalletSettingApi } from '../api';
import { DepositRequestStatus } from '../../domain/enum';
import { DepositRequestResponse } from '../dto/response/DepositRequestResponse';

export class WalletSettingRepository implements IWalletSettingRepository {
  private walletSettingApi: IWalletSettingApi;

  constructor(walletSettingApi: IWalletSettingApi) {
    this.walletSettingApi = walletSettingApi;
  }

  async getDepositRequestsPaginated(
    userId: string,
    status: DepositRequestStatus,
    page: number,
    pageSize: number,
  ): Promise<DepositRequestResponse> {
    const response = await this.walletSettingApi.getDepositRequestsPaginated(
      userId,
      status,
      page,
      pageSize,
    );

    return response;
  }
}

decorate(injectable(), WalletSettingRepository);
decorate(inject(WALLET_SETTING_TYPES.IWalletSettingApi), WalletSettingRepository, 0);

export const createWalletSettingRepository = (
  walletSettingApi: IWalletSettingApi,
): IWalletSettingRepository => {
  return new WalletSettingRepository(walletSettingApi);
};
