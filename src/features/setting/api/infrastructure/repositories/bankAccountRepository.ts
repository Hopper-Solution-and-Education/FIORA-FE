import { prisma } from '@/config';
import { BankAccount, Prisma } from '@prisma/client';

class BankAccountRepository {
  async create(data: Prisma.BankAccountCreateInput): Promise<any> {
    try {
      // const user = prisma.user.findUnique({ where: { data.u } });
      return await prisma.bankAccount.create({ data: { ...data } });
    } catch (error) {
      console.log(error);
    }
  }
  async get(): Promise<BankAccount[]> {
    return await prisma.bankAccount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async checkBankAccount(data: Prisma.BankAccountCreateInput) {
    const { bankName, accountNumber } = data;
    return await prisma.bankAccount.findFirst({
      where: {
        bankName,
        accountNumber,
      },
    });
  }

  async getById(id: string) {
    return await prisma.bankAccount.findFirst({
      where: {
        id,
      },
    });
  }
}

export const bankAccountRepository = new BankAccountRepository();
