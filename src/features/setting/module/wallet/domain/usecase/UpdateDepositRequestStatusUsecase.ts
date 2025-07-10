import { decorate, inject, injectable } from 'inversify';
import { UpdateDepositRequestStatusResponse } from '../../data/dto/response/UpdateDepositRequestStatusResponse';
import type { IWalletSettingRepository } from '../../data/repository/IWalletSettingRepository';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestStatus } from '../enum';

export interface IUpdateDepositRequestStatusUseCase {
  execute(
    id: string,
    status: DepositRequestStatus,
    remark?: string,
  ): Promise<UpdateDepositRequestStatusResponse>;
}

export class UpdateDepositRequestStatusUseCase implements IUpdateDepositRequestStatusUseCase {
  private walletRepository: IWalletSettingRepository;

  constructor(walletRepository: IWalletSettingRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(
    id: string,
    status: DepositRequestStatus,
    remark?: string,
  ): Promise<UpdateDepositRequestStatusResponse> {
    return this.walletRepository.updateDepositRequestStatus(id, status, remark);
  }
}

decorate(injectable(), UpdateDepositRequestStatusUseCase);
decorate(
  inject(WALLET_SETTING_TYPES.IWalletSettingRepository),
  UpdateDepositRequestStatusUseCase,
  0,
);
