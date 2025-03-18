export interface Account {
  id: string;
  userId: string;
  icon: string;
  name: string;
  description: string;
  type: string;
  currency: string;
  limit: string;
  balance: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  children: Account[];
}

export interface AccountState {
  accounts: {
    isLoading: boolean;
    data: Account[] | undefined;
    error: string | null;
    message?: string;
  };
  selectedAccount: Account | null;
  createDialogOpen: boolean;
  editDialogOpen: boolean;
  deleteConfirmOpen: boolean;
}

export const initialAccountState: AccountState = {
  accounts: {
    isLoading: false,
    data: undefined,
    error: null,
  },
  selectedAccount: null,
  createDialogOpen: false,
  editDialogOpen: false,
  deleteConfirmOpen: false,
};
