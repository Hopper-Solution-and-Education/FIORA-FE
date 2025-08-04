import { prisma } from '@/config';
import { KYCMethod } from '@prisma/client';

class EKycRepository {
  async create(kyc: {
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
  async getById(id: string) {
    return await prisma.eKYC.findFirst({
      where: {
        id,
      },
    });
  }
}

export const eKycRepository = new EKycRepository();
