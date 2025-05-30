import { FilterCriteria } from '@/shared/types';

export interface Account {
  id: string;
  userId: string;
  icon?: string;
  name: string;
  description?: string;
  type: AccountType;
  currency: Currency;
  limit?: number;
  balance: number;
  parentId?: string | null;
  parent?: Account | null;
  children?: Account[];
  createdAt: Date;
  updatedAt: Date;
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
