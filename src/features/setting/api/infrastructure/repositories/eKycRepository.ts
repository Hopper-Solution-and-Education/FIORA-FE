import { prisma } from '@/config';
import { KYCMethod, KYCType } from '@prisma/client';

class EKycRepository {
  async create(kyc: {
    type: KYCType;
    fieldName: string;
    status: any;
    createdBy: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    id: string;
  }): Promise<any> {
    try {
      return await prisma.eKYC.create({
        data: {
          type: kyc.type,
          method: KYCMethod.MANUAL,
          refId: null,
          fieldName: kyc.fieldName,
          status: kyc.status,
          createdBy: kyc.createdBy,
          userId: kyc.userId,
          createdAt: kyc.createdAt,
          updatedAt: kyc.updatedAt,
          id: kyc.id, // UUID
        },
      });
    } catch (error) {
      return error;
    }
  }

  async getByUser(userId: string) {
    return await prisma.eKYC.findMany({
      where: {
        userId,
      },
    });
  }

  async getById(id: string) {
    return await prisma.eKYC.findFirst({
      where: {
        id,
      },
    });
  }
}

export const eKycRepository = new EKycRepository();
