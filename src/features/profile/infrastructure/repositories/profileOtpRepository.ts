import { prisma } from '@/config';
import { sendOtpChangeEmail, sendOtpDeleteAccount } from '@/config/send-grid/sendGrid';
import { generateSixDigitNumber } from '@/shared/utils/common';
import { OtpType } from '@prisma/client';

class ProfileOtpRepository {
  /**
   * Send OTP to user's email based on the OTP type
   */
  async sendOtp(userId: string, email: string, type: OtpType, duration: string = '120') {
    const random6Digits = generateSixDigitNumber();

    // Send email based on type
    switch (type) {
      case OtpType.EMAIL:
        await sendOtpChangeEmail(email, random6Digits.toString());
        break;
      case OtpType.DELETE:
        await sendOtpDeleteAccount(email, random6Digits.toString());
        break;
      default:
        throw new Error(`Unsupported OTP type: ${type}`);
    }

    // Store OTP in database
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

  /**
   * Get the most recent OTP for a user by type
   */
  async checkOtp(userId: string, type: OtpType) {
    return await prisma.otp.findFirst({
      where: { userId, type },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete OTP after verification (optional, for one-time use enforcement)
   */
  async deleteOtp(otpId: string) {
    return await prisma.otp.delete({
      where: { id: otpId },
    });
  }

  /**
   * Verify OTP and check expiration
   */
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

    // Check if OTP has expired
    const createDate = new Date(otpRecord.createdAt);
    const expiredAt = new Date(createDate.getTime() + Number(otpRecord.duration) * 1000);

    if (expiredAt < new Date()) {
      return {
        isValid: false,
        message: 'OTP has expired',
      };
    }

    // Check if OTP matches
    if (otp.toString() !== otpRecord.otp.toString()) {
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
}

export const profileOtpRepository = new ProfileOtpRepository();
