import { BankAccount, Prisma } from '@prisma/client';

export interface IBankAccountRepository {
  create(data: Prisma.BankAccountCreateInput): Promise<BankAccount>;
  get(): Promise<BankAccount[]>;
  update(id: string, userId: string, data: Partial<BankAccount>): Promise<BankAccount>;
  findById(id: string): Promise<BankAccount | null>;
}
