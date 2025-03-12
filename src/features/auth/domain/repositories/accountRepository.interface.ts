import type { Account, AccountType, Prisma } from '@prisma/client'; // Sử dụng Account từ Prisma Client

export interface Pagination {
  page: number;
  size: number;
}

export interface SelectOptions {
  include?: Record<string, boolean>;
  select?: Record<string, boolean>;
  exclude?: Record<string, boolean>;
}

export interface IAccountRepository {
  create(account: Prisma.AccountUncheckedCreateInput): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  findAll(): Promise<Account[] | []>;
  findMany(
    where: Prisma.AccountWhereInput,
    options?: SelectOptions,
    pagination?: Pagination,
  ): Promise<Account[]>;
  update(id: string, account: Prisma.AccountUpdateInput): Promise<Account>;
  delete(options: Prisma.AccountDeleteArgs): Promise<Account>;
  updateParentBalance(parentId: string): Promise<void>;
  findByCondition(where: Prisma.AccountWhereInput): Promise<Account | null>;
  findAllAccountByUserId(userId: string): Promise<Account[] | []>;
  findManyWithCondition(
    where: Prisma.AccountWhereInput,
    select?: Prisma.AccountSelect,
    options?: Prisma.AccountFindManyArgs,
  ): Promise<Account[] | []>;
  aggregate(options: Prisma.AccountAggregateArgs): Promise<any>;
  deductBalance(tx: Prisma.TransactionClient, accountId: string, amount: number): Promise<void>;
  receiveBalance(tx: Prisma.TransactionClient, accountId: string, amount: number): Promise<void>;
  transferBalance(
    tx: Prisma.TransactionClient,
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<any>;
}

export interface AccountCreation {
  userId: string;
  description?: string;
  accountName?: string;
  icon?: string;
  parentId?: string;
  type: AccountType;
}
