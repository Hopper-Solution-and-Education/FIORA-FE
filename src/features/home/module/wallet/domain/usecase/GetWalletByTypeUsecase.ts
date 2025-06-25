import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';
import type { WalletType } from '../enum/WalletType';
import { Wallet } from '../entity/Wallet';

export interface IGetWalletByTypeUsecase {
  execute(type: WalletType): Promise<Wallet>;
}

@injectable()
export class GetWalletByTypeUsecase implements IGetWalletByTypeUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(type: WalletType): Promise<Wallet> {
    return this.walletRepository.getWalletByType(type);
  }
}
