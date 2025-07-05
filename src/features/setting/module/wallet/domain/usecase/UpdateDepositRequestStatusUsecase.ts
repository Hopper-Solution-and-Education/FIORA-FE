import { decorate, inject, injectable } from 'inversify';
import type { IWalletSettingRepository } from '../../data/repository/IWalletSettingRepository';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestStatus } from '../enum';
import { UpdateDepositRequestStatusResponse } from '../../data/dto/response/UpdateDepositRequestStatusResponse';

export interface IUpdateDepositRequestStatusUseCase {
  execute(id: string, status: DepositRequestStatus): Promise<UpdateDepositRequestStatusResponse>;
}

export class UpdateDepositRequestStatusUseCase implements IUpdateDepositRequestStatusUseCase {
  private walletRepository: IWalletSettingRepository;

  constructor(walletRepository: IWalletSettingRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(
    id: string,
    status: DepositRequestStatus,
  ): Promise<UpdateDepositRequestStatusResponse> {
    return this.walletRepository.updateDepositRequestStatus(id, status);
  }
}

decorate(injectable(), UpdateDepositRequestStatusUseCase);
decorate(
  inject(WALLET_SETTING_TYPES.IWalletSettingRepository),
  UpdateDepositRequestStatusUseCase,
  0,
);
