import { decorate, inject, injectable } from 'inversify';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import type { IWalletSettingRepository } from '../../data/repository/IWalletSettingRepository';
import { DepositRequestStatus } from '../enum';
import { DepositRequestResponse } from '../../data/dto/response/DepositRequestResponse';

export interface IGetDepositRequestsPaginatedUseCase {
  execute(
    userId: string,
    status: DepositRequestStatus,
    page: number,
    pageSize: number,
  ): Promise<DepositRequestResponse>;
}

export class GetDepositRequestsPaginatedUseCase implements IGetDepositRequestsPaginatedUseCase {
  private walletRepository: IWalletSettingRepository;

  constructor(walletRepository: IWalletSettingRepository) {
    this.walletRepository = walletRepository;
  }

  async execute(
    userId: string,
    status: DepositRequestStatus,
    page: number,
    pageSize: number,
  ): Promise<DepositRequestResponse> {
    return this.walletRepository.getDepositRequestsPaginated(userId, status, page, pageSize);
  }
}

decorate(injectable(), GetDepositRequestsPaginatedUseCase);
decorate(
  inject(WALLET_SETTING_TYPES.IWalletSettingRepository),
  GetDepositRequestsPaginatedUseCase,
  0,
);

export const createGetDepositRequestsPaginatedUseCase = (
  walletRepository: IWalletSettingRepository,
): IGetDepositRequestsPaginatedUseCase => {
  return new GetDepositRequestsPaginatedUseCase(walletRepository);
};
