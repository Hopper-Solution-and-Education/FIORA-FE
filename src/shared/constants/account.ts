import { Banknote, CreditCard, PiggyBank, TrendingDown, Wallet, TrendingUp } from 'lucide-react';

// Define account types and their rules
const ACCOUNT_TYPES = {
  PAYMENT: 'Payment',
  SAVING: 'Saving',
  CREDIT_CARD: 'CreditCard',
  DEBT: 'Debt',
  LENDING: 'Lending',
  INVEST: 'Invest',
};

// Define account type validation rules
const ACCOUNT_RULES = {
  [ACCOUNT_TYPES.PAYMENT]: {
    minBalance: 0,
    maxBalance: null,
    description: 'Use to record daily payment and transfer transactions. Balance must be >= 0.',
  },
  [ACCOUNT_TYPES.SAVING]: {
    minBalance: 0,
    maxBalance: null,
    description: 'Use to record saving transactions and interest only. Balance must be >= 0.',
  },
  [ACCOUNT_TYPES.CREDIT_CARD]: {
    minBalance: null,
    maxBalance: 0,
    description:
      'Use to record daily payment and transfer (only internal transfer) transactions. Balance must be <= 0.',
  },
  [ACCOUNT_TYPES.DEBT]: {
    minBalance: null,
    maxBalance: 0,
    description: 'Use to record loan transactions only. Balance must be <= 0.',
  },
  [ACCOUNT_TYPES.LENDING]: {
    minBalance: 0,
    maxBalance: null,
    description: 'Use to record lending transactions only. Balance must be >= 0.',
  },
  [ACCOUNT_TYPES.INVEST]: {
    minBalance: 0,
    maxBalance: null,
    description: 'Use to record invest transactions only. Balance must be >= 0.',
  },
};

// Define icons for each account type
const ACCOUNT_ICONS = [
  { id: 'wallet', name: 'Wallet', icon: Wallet, types: [ACCOUNT_TYPES.PAYMENT] },
  { id: 'piggy-bank', name: 'Piggy Bank', icon: PiggyBank, types: [ACCOUNT_TYPES.SAVING] },
  { id: 'credit-card', name: 'Credit Card', icon: CreditCard, types: [ACCOUNT_TYPES.CREDIT_CARD] },
  { id: 'trending-down', name: 'Debt', icon: TrendingDown, types: [ACCOUNT_TYPES.DEBT] },
  { id: 'banknote', name: 'Lending', icon: Banknote, types: [ACCOUNT_TYPES.LENDING] },
  { id: 'trending-up', name: 'Invest', icon: TrendingUp, types: [ACCOUNT_TYPES.INVEST] },
];

// Sample parent accounts for demo
const PARENT_ACCOUNTS = [
  { id: '1', name: 'My Payment Account', type: ACCOUNT_TYPES.PAYMENT },
  { id: '2', name: 'My Savings', type: ACCOUNT_TYPES.SAVING },
  { id: '3', name: 'My Credit Cards', type: ACCOUNT_TYPES.CREDIT_CARD },
  { id: '4', name: 'My Loans', type: ACCOUNT_TYPES.DEBT },
  { id: '5', name: 'My Lending', type: ACCOUNT_TYPES.LENDING },
  { id: '6', name: 'My Investments', type: ACCOUNT_TYPES.INVEST },
];

export { ACCOUNT_TYPES, ACCOUNT_RULES, ACCOUNT_ICONS, PARENT_ACCOUNTS };
