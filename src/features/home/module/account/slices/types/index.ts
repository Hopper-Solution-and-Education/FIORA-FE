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
  children?: Account[];
  createdAt: Date;
  updatedAt: Date;
}

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
  selectedAccount: Account | null;
  accountCreateDialog: boolean;
  accountUpdateDialog: boolean;
  accountDeleteDialog: boolean;
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
  selectedAccount: null,
  accountCreateDialog: false,
  accountUpdateDialog: false,
  accountDeleteDialog: false,
};

export enum AccountType {
  Payment = 'Payment',
  Saving = 'Saving',
  Lending = 'Lending',
  Debt = 'Debt',
  CreditCard = 'CreditCard',
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
