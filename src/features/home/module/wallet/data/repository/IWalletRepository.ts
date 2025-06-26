import { Wallet } from '../../domain/entity/Wallet';
import { WalletType } from '../../domain/enum';
import { DepositRequest } from '../../domain/entity/DepositRequest';
import { DepositRequestStatus } from '../../domain/enum/DepositRequestStatus';
import { PackageFX } from '../../domain/entity/PackageFX';

export interface IWalletRepository {
  getWalletByType(type: WalletType): Promise<Wallet>;
  getAllWallets(): Promise<Wallet[]>;
  getDepositRequestsByType(type: DepositRequestStatus): Promise<DepositRequest[]>;
  getAllPackageFX(): Promise<PackageFX[]>;
}
