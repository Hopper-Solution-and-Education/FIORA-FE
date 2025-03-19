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

export interface ApiAccount {
  id: string;
  userId: string;
  icon?: string;
  name: string;
  description?: string;
  type: string;
  currency: string;
  limit: string;
  balance: string;
  parentId: string | null;
  children?: ApiAccount[];
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

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

export type FormAccount = Omit<Account, 'createdAt' | 'updatedAt'> & {
  available_limit: number;
  parent: string | null;
};

export const isPositiveType = (type: AccountType): boolean => {
  return [AccountType.Payment, AccountType.Saving, AccountType.Lending].includes(type);
};

export const formatCurrency = (amount: number, currency: Currency = Currency.VND): string => {
  return (
    new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
    }).format(Math.abs(amount)) +
    ' ' +
    currency
  );
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const flattenAccounts = (accounts: Account[]): Account[] => {
  return accounts.reduce((acc: Account[], account) => {
    acc.push(account);
    if (account.children) {
      acc.push(...flattenAccounts(account.children));
    }
    return acc;
  }, []);
};

export const findParentBalance = (accounts: Account[], parentId: string | null): number => {
  if (!parentId) return 0;
  const parent = accounts.find((account) => account.id === parentId);
  if (!parent) return 0;

  const balance =
    typeof parent.balance === 'string' ? Number.parseFloat(parent.balance) : parent.balance;
  return Math.abs(balance);
};

// Calculate total balance from a list of accounts
export const calculateTotalBalance = (accounts: Account[]): number => {
  return accounts.reduce((total, account) => {
    const balance =
      typeof account.balance === 'string' ? Number.parseFloat(account.balance) : account.balance;
    return total + balance;
  }, 0);
};

export const calculateBarWidth = (
  account: Account,
  parentBalance: number,
  parentWidth?: number,
): number => {
  const balance =
    typeof account.balance === 'string' ? Number.parseFloat(account.balance) : account.balance;
  const absBalance = Math.abs(balance);

  // Calculate the base width percentage
  let widthPercentage = Math.max((absBalance / parentBalance) * 200, 6);

  // If there's a parent width constraint, scale the width accordingly
  if (parentWidth !== undefined) {
    widthPercentage = Math.min(widthPercentage, parentWidth);
  }

  return widthPercentage;
};

// Helper function to get parent's width
export const getParentWidth = (
  account: Account,
  allAccounts: Account[],
  totalPositiveBalance: number,
  totalNegativeBalance: number,
): number | undefined => {
  if (!account.parentId) return undefined;

  const parent = allAccounts.find((a) => a.id === account.parentId);
  if (!parent) return undefined;

  const parentBalance = isPositiveType(parent.type) ? totalPositiveBalance : totalNegativeBalance;

  return calculateBarWidth(parent, parentBalance);
};

// Parse API response data
export const parseApiData = (data: any[]): Account[] => {
  // First, create a map of all accounts by ID
  const accountMap = new Map<string, Account>();

  // Process all accounts first
  data.forEach((item) => {
    const account: Account = {
      ...item,
      children: item.children || [],
    };
    accountMap.set(account.id, account);
  });

  // Filter out accounts that are children of other accounts to avoid duplication
  return data.filter((item) => {
    return !item.parentId || !accountMap.has(item.parentId);
  });
};
