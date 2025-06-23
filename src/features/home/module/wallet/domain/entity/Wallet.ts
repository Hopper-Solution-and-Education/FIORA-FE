import { WalletType } from './WalletType';

export type Wallet = {
  id: string;
  userId: string;
  icon: string;
  type: WalletType;
  name: string;
  frBalanceActive: number;
  frBalanceFrozen: number;
  creditLimit?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};
