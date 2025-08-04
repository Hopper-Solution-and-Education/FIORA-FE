import { prisma } from '@/config';
import { BankAccount, KYCStatus, Prisma } from '@prisma/client';

class BankAccountRepository {
  async create(data: Prisma.BankAccountCreateInput, kycId: string): Promise<any> {
    try {
      return prisma.$transaction(async (tx) => {
        const bankAccount = await prisma.bankAccount.create({ data: { ...data } });

        await tx.eKYC.update({ where: { id: kycId }, data: { refId: bankAccount?.id || null } });

        return bankAccount;
      });
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

  async getByUserId(id: string) {
    return await prisma.bankAccount.findFirst({
      where: {
        userId: id,
      },
    });
  }

  async verify(
    data: {
      kycId: string;
      remarks: string;
      status: KYCStatus;
    },
    bankAccountId: string,
    userId: string,
  ): Promise<any> {
    try {
      const { kycId, remarks, status } = data;
      return prisma.$transaction(async (tx) => {
        const bankAccount = await tx.bankAccount.update({
          where: { id: bankAccountId },
          data: {
            remarks: remarks || '',
            status: status,
            updatedAt: new Date(),
            updatedBy: userId,
          },
        });

        await tx.eKYC.update({
          where: { id: kycId, refId: bankAccountId },
          data: { updatedAt: new Date(), updatedBy: userId, status: status, verifiedBy: userId },
        });

        return bankAccount;
      });
    } catch (error) {
      console.log(error);
      return error as unknown;
    }
  }

  async delete(id: string) {
    try {
      return prisma.$transaction(async (tx) => {
        const bank = await tx.bankAccount.delete({ where: { id } });

        const eKycRecord = await tx.eKYC.findFirst({ where: { refId: id } });
        if (eKycRecord) {
          await tx.eKYC.delete({ where: { id: eKycRecord.id } });
        }

        return bank;
      });
    } catch (error) {
      console.log(error);
      return error as unknown;
    }
  }
}

export const bankAccountRepository = new BankAccountRepository();
