import { AttachmentData } from '@/features/setting/api/types/attachmentTypes';
import { FilterObject } from '@/shared/types/filter.types';
import { decorate, inject, injectable } from 'inversify';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestStatus } from '../../domain';
import { DepositRequestsPaginated } from '../../presentation';
import type { IWalletSettingApi } from '../api';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';
import { WalletSettingMapper } from '../mapper';
import { IWalletSettingRepository } from './IWalletSettingRepository';

export class WalletSettingRepository implements IWalletSettingRepository {
  private walletSettingApi: IWalletSettingApi;

  constructor(walletSettingApi: IWalletSettingApi) {
    this.walletSettingApi = walletSettingApi;
  }

  async getDepositRequestsPaginated(
    page: number,
    pageSize: number,
    filter?: FilterObject,
  ): Promise<DepositRequestsPaginated> {
    const response = await this.walletSettingApi.getDepositRequestsPaginated(
      page,
      pageSize,
      filter,
    );
    return WalletSettingMapper.toDepositRequestsPaginated(response);
  }

  async updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
    remark?: string,
    attachmentData?: AttachmentData,
  ): Promise<UpdateDepositRequestStatusResponse> {
    const response = await this.walletSettingApi.updateDepositRequestStatus(
      id,
      status,
      remark,
      attachmentData,
    );
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
