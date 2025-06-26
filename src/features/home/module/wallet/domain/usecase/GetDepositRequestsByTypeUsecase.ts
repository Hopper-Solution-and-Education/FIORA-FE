import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';
import { DepositRequestStatus } from '../enum/DepositRequestStatus';
import { DepositRequest } from '../entity/DepositRequest';

@injectable()
export class GetDepositRequestsByTypeUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  execute(type: DepositRequestStatus): Promise<DepositRequest[]> {
    return this.walletRepository.getDepositRequestsByType(type);
  }
}
