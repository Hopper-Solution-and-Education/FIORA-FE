import { prisma } from '@/config';
import { generateSixDigitNumber } from '@/shared/utils/common';
import { KYCMethod, KYCType, OtpType } from '@prisma/client';

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
      const newKyc = await prisma.eKYC.create({
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
      return newKyc;
    } catch (error) {
      console.log(error);
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

  async getByType(userId: string, type: KYCType) {
    return await prisma.eKYC.findFirst({
      where: {
        userId,
        type,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendOtp(userId: string, type: OtpType, duration: string) {
    const random6Digits = generateSixDigitNumber();
    // await sendOtpVerify(userId, random6Digits.toString());
    return await prisma.otp.create({
      data: {
        type: type,
        duration: duration,
        otp: random6Digits.toString(),
        userId: userId,
        createdAt: new Date(),
        id: crypto.randomUUID(),
      },
    });
  }

  async checkOtp(userId: string, type: OtpType) {
    return await prisma.otp.findFirst({
      where: { userId, type },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const eKycRepository = new EKycRepository();
