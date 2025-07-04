import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';
import type { WalletType } from '../enum/WalletType';
import { Wallet } from '../entity/Wallet';

export interface IGetWalletUsecase {
  execute(type: WalletType): Promise<Wallet>;
}

@injectable()
export class GetWalletUsecase implements IGetWalletUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(type: WalletType): Promise<Wallet> {
    return this.walletRepository.getWalletByType(type);
  }
}
