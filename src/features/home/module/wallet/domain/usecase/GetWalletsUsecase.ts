import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';
import { Wallet } from '../entity/Wallet';

export interface IGetWalletsUsecase {
  execute(): Promise<Wallet[]>;
}

@injectable()
export class GetWalletsUsecase implements IGetWalletsUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(): Promise<Wallet[]> {
    return this.walletRepository.getAllWallets();
  }
}
