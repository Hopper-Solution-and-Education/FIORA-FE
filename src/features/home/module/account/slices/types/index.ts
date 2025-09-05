import { FilterCriteria } from '@/shared/types';

export interface Account {
  id: string;
  userId: string;
  baseAmount: number;
  icon?: string;
  name: string;
  description?: string | null;
  type: AccountType;
  currencyId: string;
  currency: string;
  baseCurrency: string;
  limit?: string;
  balance: string;
  parentId?: string | null;
  parent?: Account | null;
  children?: Account[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string | null;
  color?: string | null;
  toTransactions?: any[];
  fromTransactions?: any[];
}

export type AccountFilterResponse = {
  data: Account[];
  maxBalance: number;
  minBalance: number;
};

export interface AccountState {
  accounts: {
    isLoading: boolean;
    data: Account[] | undefined;
    error: string | null;
    message?: string;
  };
  parentAccounts: {
    isLoading: boolean;
    data: Account[] | undefined;
    error: string | null;
    message?: string;
  };
  minBalance: number;
  maxBalance: number;
  refresh: boolean;
  selectedAccount: Account | null;
  accountCreateDialog: boolean;
  accountUpdateDialog: boolean;
  accountDeleteDialog: boolean;
  filterCriteria: FilterCriteria;
}

export const initialAccountState: AccountState = {
  accounts: {
    isLoading: false,
    data: undefined,
    error: null,
  },
  parentAccounts: {
    isLoading: false,
    data: undefined,
    error: null,
  },
  minBalance: 0,
  maxBalance: 0,
  refresh: false,
  selectedAccount: null,
  accountCreateDialog: false,
  accountUpdateDialog: false,
  accountDeleteDialog: false,
  filterCriteria: { userId: '', filters: {} },
};

export enum AccountType {
  Payment = 'Payment',
  Saving = 'Saving',
  Lending = 'Lending',
  Debt = 'Debt',
  CreditCard = 'CreditCard',
  Invest = 'Invest',
}

export enum Currency {
  USD = 'USD',
  VND = 'VND',
  JYB = 'JYB',
}

export interface CreateAccountModalProps {
  isOpen: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  setTriggered: (isTriggered: boolean) => void;
  isTriggered: boolean;
}

export interface EditAccountModalProps {
  isOpen: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setTriggered: (isTriggered: boolean) => void;
  isTriggered: boolean;
  account: Account;
}
