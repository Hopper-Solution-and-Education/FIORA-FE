import { prisma, sendOtpVerify } from '@/config';
import { SessionUser } from '@/shared/types/session';
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
      return prisma.$transaction(async (tx) => {
        const newKyc = await tx.eKYC.create({
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

        const user = await tx.user.findFirst({
          where: { id: kyc.userId },
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
            updatedBy: kyc.userId,
          },
        });
        return newKyc;
      });
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
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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

  async sendOtp(user: SessionUser, type: OtpType, duration: string) {
    const random6Digits = generateSixDigitNumber();
    await sendOtpVerify(user.email, random6Digits.toString());
    return await prisma.otp.create({
      data: {
        type: type,
        duration: duration,
        otp: random6Digits.toString(),
        userId: user.id,
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

  async verifyOtp(
    userId: string,
    otp: string,
    type: OtpType,
  ): Promise<{
    isValid: boolean;
    message?: string;
    otpRecord?: any;
  }> {
    const otpRecord = await this.checkOtp(userId, type);

    if (!otpRecord) {
      return {
        isValid: false,
        message: 'OTP not found or has expired',
      };
    }

    const createDate = new Date(otpRecord.createdAt);
    const expiredAt = new Date(createDate.getTime() + Number(otpRecord.duration) * 1000);

    if (expiredAt < new Date()) {
      return {
        isValid: false,
        message: 'OTP has expired',
      };
    }

    if (otpRecord.otp !== otp) {
      return {
        isValid: false,
        message: 'Invalid OTP',
      };
    }

    return {
      isValid: true,
      otpRecord,
    };
  }

  async updateStatus(kycId: string, status: any, verifiedBy: string) {
    try {
      return await prisma.eKYC.update({
        where: { id: kycId },
        data: {
          status: status,
          verifiedBy: verifiedBy,
          updatedAt: new Date(),
          updatedBy: verifiedBy,
        },
      });
    } catch (error) {
      console.log(error);
      return error as unknown;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.eKYC.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      return error as unknown;
    }
  }
}

export const eKycRepository = new EKycRepository();
