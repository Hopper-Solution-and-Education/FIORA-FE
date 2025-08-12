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

// Email template IDs for deposit requests
export const DEPOSIT_APPROVED_EMAIL_TEMPLATE_ID = 'd191b380-3a52-4904-b39c-490360eb41c6';
export const DEPOSIT_REJECTED_EMAIL_TEMPLATE_ID = '0c03e649-d219-4098-b886-f62ec5b8e233';
