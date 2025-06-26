import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { WalletType } from '../../domain/enum';
import type { IWalletApi } from '../api';
import type { IWalletRepository } from './IWalletRepository';
import WalletMapper from '../mapper/WalletMapper';
import { Wallet } from '../../domain/entity/Wallet';
import { DepositRequestStatus } from '../../domain/enum/DepositRequestStatus';
import { DepositRequestMapper } from '../mapper/DepositRequestMapper';
import { DepositRequest } from '../../domain/entity/DepositRequest';
import { PackageFXMapper } from '../mapper/PackageFXMapper';
import { PackageFX } from '../../domain/entity/PackageFX';

@injectable()
export class WalletRepository implements IWalletRepository {
  constructor(@inject(WALLET_TYPES.IWalletApi) private readonly _walletApi: IWalletApi) {}

  getWalletByType(type: WalletType): Promise<Wallet> {
    return this._walletApi.getWalletByType({ type }).then(WalletMapper.toWalletResponse);
  }

  getAllWallets(): Promise<Wallet[]> {
    return this._walletApi.getAllWallets().then(WalletMapper.toWalletsResponse);
  }

  getDepositRequestsByType(type: DepositRequestStatus): Promise<DepositRequest[]> {
    return this._walletApi
      .getDepositRequestsByType(type)
      .then(DepositRequestMapper.toDepositRequests);
  }

  getAllPackageFX(): Promise<PackageFX[]> {
    return this._walletApi.getAllPackageFX().then(PackageFXMapper.toPackageFXs);
  }
}
