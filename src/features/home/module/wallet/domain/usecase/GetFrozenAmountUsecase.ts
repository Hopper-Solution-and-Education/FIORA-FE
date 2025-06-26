import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';

@injectable()
export class GetFrozenAmountUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  execute(): Promise<number> {
    return this.walletRepository.getFrozenDepositAmount();
  }
}
