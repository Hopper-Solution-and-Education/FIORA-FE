import type { Account, AccountType } from '@prisma/client'; // Sử dụng Account từ Prisma Client

export interface Pagination {
  skip: number;
  take: number;
}

export interface SelectOptions {
  include?: Record<string, boolean>;
  exclude?: Record<string, boolean>;
}

export interface IAccountRepository {
  create(account: Account): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  findAll(): Promise<Account[]>;
  update(id: string, account: Partial<Account>): Promise<Account>;
  delete(id: string): Promise<void>;
}

export interface AccountCreation {
  userId: string;
  description?: string;
  accountName?: string;
  icon?: string;
  parentId?: string;
  type: AccountType;
}
