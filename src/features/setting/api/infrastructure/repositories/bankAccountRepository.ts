import { prisma } from '@/config';
import { SessionUser } from '@/shared/types/session';
import {
  BankAccount,
  ChannelType,
  KYCMethod,
  KYCStatus,
  KYCType,
  NotificationType,
  Prisma,
} from '@prisma/client';

class BankAccountRepository {
  async create(data: Prisma.BankAccountCreateInput, user: SessionUser): Promise<any> {
    try {
      return prisma.$transaction(async (tx) => {
        const bankAccount = await prisma.bankAccount.create({ data: { ...data } });

        await tx.eKYC.create({
          data: {
            type: KYCType.BANK,
            fieldName: 'BANK',
            status: KYCStatus.PENDING,
            createdBy: user.id.toString(),
            userId: user.id.toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            id: crypto.randomUUID(),
            refId: bankAccount.id,
            method: KYCMethod.MANUAL,
          },
        });
        await tx.notification.create({
          data: {
            title: `Verify new bank account!`,
            message: `User ${user.email} has submitted a new verify bank account.`,
            channel: ChannelType.BOX,
            notifyTo: NotificationType.ADMIN_CS,
            type: 'BANK',
            emails: [user.email],
            emailTemplateId: null,
            createdBy: null,
          },
        });
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
      include: {
        Attachment: true,
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
        const user = await tx.user.findFirst({
          where: { id: bankAccount.userId },
          select: { id: true, kyc_levels: true },
        });
        const updatedKycLevels = user?.kyc_levels || [];

        if (!updatedKycLevels.includes('2')) {
          updatedKycLevels.push('2');
        }
        await tx.user.update({
          where: { id: user?.id },
          data: {
            kyc_levels: updatedKycLevels,
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
