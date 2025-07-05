import { decorate, inject, injectable } from 'inversify';
import type { IWalletSettingRepository } from '../../data/repository/IWalletSettingRepository';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestsPaginated } from '../../presentation';

export interface IGetDepositRequestsPaginatedUseCase {
  execute(page: number, pageSize: number): Promise<DepositRequestsPaginated>;
}

export class GetDepositRequestsPaginatedUseCase implements IGetDepositRequestsPaginatedUseCase {
  private walletRepository: IWalletSettingRepository;

  constructor(walletRepository: IWalletSettingRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(page: number, pageSize: number): Promise<DepositRequestsPaginated> {
    return this.walletRepository.getDepositRequestsPaginated(page, pageSize);
  }
}

decorate(injectable(), GetDepositRequestsPaginatedUseCase);
decorate(
  inject(WALLET_SETTING_TYPES.IWalletSettingRepository),
  GetDepositRequestsPaginatedUseCase,
  0,
);
