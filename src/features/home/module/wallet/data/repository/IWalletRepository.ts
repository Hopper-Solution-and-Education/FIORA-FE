import { Wallet } from '../../domain/entity/Wallet';
import { WalletType } from '../../domain/entity/WalletType';

export interface IWalletRepository {
  getWalletByType(type: WalletType): Promise<Wallet>;
}
