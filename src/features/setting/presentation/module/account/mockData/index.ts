import { Banknote, CreditCard, PiggyBank, TrendingDown, Wallet } from 'lucide-react';
import { Account } from '../../../settingSlices/expenseIncomeSlides/types';
import { AccountType, Currency } from '@prisma/client';

// Define account types and their rules
const ACCOUNT_TYPES = {
  PAYMENT: 'Payment',
  SAVING: 'Saving',
  CREDIT_CARD: 'CreditCard',
  DEBT: 'Debt',
  LENDING: 'Lending',
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
};

// Define icons for each account type
const ACCOUNT_ICONS = [
  { id: 'wallet', name: 'Wallet', icon: Wallet, types: [ACCOUNT_TYPES.PAYMENT] },
  { id: 'piggy-bank', name: 'Piggy Bank', icon: PiggyBank, types: [ACCOUNT_TYPES.SAVING] },
  { id: 'credit-card', name: 'Credit Card', icon: CreditCard, types: [ACCOUNT_TYPES.CREDIT_CARD] },
  { id: 'trending-down', name: 'Debt', icon: TrendingDown, types: [ACCOUNT_TYPES.DEBT] },
  { id: 'banknote', name: 'Lending', icon: Banknote, types: [ACCOUNT_TYPES.LENDING] },
];

// Sample parent accounts for demo
const PARENT_ACCOUNTS = [
  { id: '1', name: 'My Payment Account', type: ACCOUNT_TYPES.PAYMENT },
  { id: '2', name: 'My Savings', type: ACCOUNT_TYPES.SAVING },
  { id: '3', name: 'My Credit Cards', type: ACCOUNT_TYPES.CREDIT_CARD },
  { id: '4', name: 'My Loans', type: ACCOUNT_TYPES.DEBT },
  { id: '5', name: 'My Lending', type: ACCOUNT_TYPES.LENDING },
];

const FALLBACK_PARENT_ACCOUNTS: Account[] = [
  {
    id: '1',
    userId: 'sample-user',
    icon: 'wallet',
    name: 'My Payment Account',
    description: 'Sample payment account',
    type: ACCOUNT_TYPES.PAYMENT,
    currency: 'USD',
    limit: '0',
    balance: '1000',
    parentId: null,
  },
  {
    id: '2',
    userId: 'sample-user',
    icon: 'piggy-bank',
    name: 'My Savings',
    description: 'Sample savings account',
    type: ACCOUNT_TYPES.SAVING,
    currency: 'USD',
    limit: '0',
    balance: '5000',
    parentId: null,
  },
];

// Mock data for the balance chart
export const mockAccounts: Account[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Total Balance',
    type: AccountType.Payment,
    currency: Currency.USD,
    balance: 109000,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: '2',
        userId: 'user1',
        name: 'Payment',
        type: AccountType.Payment,
        currency: Currency.USD,
        balance: 9000,
        parentId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [
          {
            id: '21',
            userId: 'user1',
            name: 'Checking Account',
            type: AccountType.Payment,
            currency: Currency.USD,
            balance: 5000,
            parentId: '2',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '22',
            userId: 'user1',
            name: 'Cash Wallet',
            type: AccountType.Payment,
            currency: Currency.USD,
            balance: 4000,
            parentId: '2',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      {
        id: '3',
        userId: 'user1',
        name: 'Saving',
        type: AccountType.Saving,
        currency: Currency.USD,
        balance: 10000,
        parentId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [
          {
            id: '31',
            userId: 'user1',
            name: 'Emergency Fund',
            type: AccountType.Saving,
            currency: Currency.USD,
            balance: 6000,
            parentId: '3',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '32',
            userId: 'user1',
            name: 'Vacation Fund',
            type: AccountType.Saving,
            currency: Currency.USD,
            balance: 4000,
            parentId: '3',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      {
        id: '5',
        userId: 'user1',
        name: 'Lending',
        type: AccountType.Lending,
        currency: Currency.USD,
        balance: 20000,
        parentId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [
          {
            id: '51',
            userId: 'user1',
            name: 'Personal Loan',
            type: AccountType.Lending,
            currency: Currency.USD,
            balance: 15000,
            parentId: '5',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '52',
            userId: 'user1',
            name: 'Friend Loan',
            type: AccountType.Lending,
            currency: Currency.USD,
            balance: 5000,
            parentId: '5',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      {
        id: '6',
        userId: 'user1',
        name: 'Credit Card',
        type: AccountType.CreditCard,
        currency: Currency.USD,
        balance: -29000,
        parentId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [
          {
            id: '61',
            userId: 'user1',
            name: 'Visa Card',
            type: AccountType.CreditCard,
            currency: Currency.USD,
            balance: -15000,
            parentId: '6',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '62',
            userId: 'user1',
            name: 'Mastercard',
            type: AccountType.CreditCard,
            currency: Currency.USD,
            balance: -14000,
            parentId: '6',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      {
        id: '7',
        userId: 'user1',
        name: 'Debt',
        type: AccountType.Debt,
        currency: Currency.USD,
        balance: -80000,
        parentId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [
          {
            id: '71',
            userId: 'user1',
            name: 'Mortgage',
            type: AccountType.Debt,
            currency: Currency.USD,
            balance: -70000,
            parentId: '7',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '72',
            userId: 'user1',
            name: 'Car Loan',
            type: AccountType.Debt,
            currency: Currency.USD,
            balance: -10000,
            parentId: '7',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
    ],
  },
];

export { ACCOUNT_TYPES, ACCOUNT_RULES, ACCOUNT_ICONS, PARENT_ACCOUNTS, FALLBACK_PARENT_ACCOUNTS };
