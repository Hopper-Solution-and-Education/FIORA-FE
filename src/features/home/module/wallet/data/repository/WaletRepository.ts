import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { WalletType } from '../../domain/entity/WalletType';
import type { IWalletApi } from '../api';
import type { IWalletRepository } from './IWalletRepository';
import WalletMapper from '../mapper/WalletMapper';
import { Wallet } from '../../domain/entity/Wallet';

@injectable()
export class WalletRepository implements IWalletRepository {
  constructor(@inject(WALLET_TYPES.IWalletApi) private readonly _walletApi: IWalletApi) {}

  getWalletByType(type: WalletType): Promise<Wallet> {
    return this._walletApi.getWalletByType({ type }).then(WalletMapper.toWalletResponse);
  }
}
