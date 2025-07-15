import { Currency } from '@/shared/types';
import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import { DepositRequest } from '../../domain/entity/DepositRequest';
import { PackageFX } from '../../domain/entity/PackageFX';
import { Wallet } from '../../domain/entity/Wallet';
import type { WalletType } from '../../domain/enum';
import { DepositRequestStatus } from '../../domain/enum/DepositRequestStatus';
import type { IWalletApi } from '../api';
import { CreateDepositRequestDto } from '../dto/request/CreateDepositRequestDto';
import { DepositRequestMapper } from '../mapper/DepositRequestMapper';
import { PackageFXMapper } from '../mapper/PackageFXMapper';
import WalletMapper from '../mapper/WalletMapper';
import type { IWalletRepository } from './IWalletRepository';

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

  createDepositRequest(data: CreateDepositRequestDto, currency: Currency): Promise<DepositRequest> {
    return this._walletApi
      .createDepositRequest(data, currency)
      .then((res) => DepositRequestMapper.toDepositRequest(res.data));
  }

  getFrozenDepositAmount(): Promise<number> {
    return this._walletApi.getFrozenDepositAmount().then((res) => res.data.amount);
  }
}
