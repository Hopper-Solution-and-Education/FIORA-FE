import { DEFAULT_MAX_BALANCE, DEFAULT_MIN_BALANCE } from '../../data';

export interface WalletFilterParams {
  walletTypes: string[];
  balanceMin: number;
  balanceMax: number;
}

export const filterParamsInitState: WalletFilterParams = {
  walletTypes: [],
  balanceMin: DEFAULT_MIN_BALANCE,
  balanceMax: DEFAULT_MAX_BALANCE,
};
