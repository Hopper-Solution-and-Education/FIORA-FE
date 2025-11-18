import { WalletType } from '@prisma/client';

export const WALLET_TYPE_ICONS: Record<WalletType, string> = {
  [WalletType.Payment]: 'dollarSign',
  [WalletType.Invest]: 'trendingUp',
  [WalletType.Saving]: 'piggyBank',
  [WalletType.Lending]: 'user',
  [WalletType.BNPL]: 'billing',
  [WalletType.Debt]: 'banknoteArrowDown',
  [WalletType.Referral]: 'userPlus',
  [WalletType.Cashback]: 'circleFadingArrowUp',
  [WalletType.Staking]: 'handCoins',
};

export const DEFAULT_WALLET_FIELDS = {
  frBalanceActive: 0,
  frBalanceFrozen: 0,
  creditLimit: null,
  name: null,
  createdBy: null,
  updatedBy: null,
};

export const MAX_REF_CODE_ATTEMPTS = 10;

export const PAYMENT_ACCOUNT_DEDUCT_RATE = 25000;

export const ALLOWED_CURRENCIES = ['VND', 'USD'];
