import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';
import type { DepositRequest } from '../entity/DepositRequest';

@injectable()
export class CreateDepositRequestUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  execute(packageFXId: string, depositProofUrl: string): Promise<DepositRequest> {
    return this.walletRepository.createDepositRequest(packageFXId, depositProofUrl);
  }
}
