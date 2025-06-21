import type { WalletType } from '../../domain/entity/WalletType';
import type { Wallet } from '../../domain/entity/Wallet';

export interface WalletState {
  wallets: Wallet[];
  loading: boolean;
  error: string | null;
  selectedWalletType: WalletType | null;
}

export interface GetWalletRequest {
  type: WalletType;
}

export interface GetWalletSuccess {
  wallets: Wallet[];
}

export interface GetWalletFailure {
  error: string;
}
