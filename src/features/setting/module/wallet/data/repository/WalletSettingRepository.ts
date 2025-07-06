import { decorate, inject, injectable } from 'inversify';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestsPaginated } from '../../presentation';
import type { IWalletSettingApi } from '../api';
import { WalletSettingMapper } from '../mapper';
import { IWalletSettingRepository } from './IWalletSettingRepository';
import { DepositRequestStatus } from '../../domain';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';

export class WalletSettingRepository implements IWalletSettingRepository {
  private walletSettingApi: IWalletSettingApi;

  constructor(walletSettingApi: IWalletSettingApi) {
    this.walletSettingApi = walletSettingApi;
  }

  async getDepositRequestsPaginated(
    page: number,
    pageSize: number,
  ): Promise<DepositRequestsPaginated> {
    const response = await this.walletSettingApi.getDepositRequestsPaginated(page, pageSize);

    return WalletSettingMapper.toDepositRequestsPaginated(response);
  }

  async updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
  ): Promise<UpdateDepositRequestStatusResponse> {
    const response = await this.walletSettingApi.updateDepositRequestStatus(id, status);
    return WalletSettingMapper.toUpdateDepositRequestStatus(response.data);
  }
}

decorate(injectable(), WalletSettingRepository);
decorate(inject(WALLET_SETTING_TYPES.IWalletSettingApi), WalletSettingRepository, 0);

export const createWalletSettingRepository = (
  walletSettingApi: IWalletSettingApi,
): IWalletSettingRepository => {
  return new WalletSettingRepository(walletSettingApi);
};
