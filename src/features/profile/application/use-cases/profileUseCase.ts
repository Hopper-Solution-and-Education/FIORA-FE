import { OtpType } from '@prisma/client';
import type { UpdateProfileRequest, UserProfile } from '../../domain/entities/models/profile';
import type { IProfileRepository } from '../../domain/repositories/profileRepository.interface';
import { profileOtpRepository } from '../../infrastructure/repositories/profileOtpRepository';
import { profileRepository } from '../../infrastructure/repositories/profileRepository';

class ProfileUseCase {
  constructor(
    private repo: IProfileRepository,
    private otpRepo: typeof profileOtpRepository,
  ) {}

  async getById(userId: string): Promise<UserProfile | null> {
    return this.repo.getById(userId);
  }

  async getByEmail(email: string): Promise<UserProfile | null> {
    return this.repo.getByEmail(email);
  }

  async getByIdWithPassword(userId: string): Promise<any> {
    return this.repo.getByIdWithPassword(userId);
  }

  async update(
    userId: string,
    payload: UpdateProfileRequest,
    updateBy?: string,
  ): Promise<UserProfile> {
    return this.repo.update(userId, payload, updateBy);
  }

  async updateEmail(userId: string, email: string): Promise<UserProfile> {
    return this.repo.updateEmail(userId, email);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    return this.repo.updatePassword(userId, hashedPassword);
  }

  async softDelete(userId: string): Promise<void> {
    return this.repo.softDelete(userId);
  }

  // OTP Methods
  async sendOtpForEmail(userId: string, email: string): Promise<void> {
    await this.otpRepo.sendOtp(userId, email, OtpType.EMAIL);
  }

  async sendOtpForDelete(userId: string, email: string): Promise<void> {
    await this.otpRepo.sendOtp(userId, email, OtpType.DELETE);
  }

  async verifyOtp(
    userId: string,
    otp: string,
    type: OtpType,
  ): Promise<{ isValid: boolean; message?: string }> {
    return this.otpRepo.verifyOtp(userId, otp, type);
  }

  async changeEmailWithOtp(
    userId: string,
    newEmail: string,
    otp: string,
  ): Promise<{ success: boolean; message: string; data?: UserProfile }> {
    // Verify OTP
    const verification = await this.otpRepo.verifyOtp(userId, otp, OtpType.EMAIL);

    if (!verification.isValid) {
      return {
        success: false,
        message: verification.message || 'Invalid OTP',
      };
    }

    // Check if email already exists
    const existingUser = await this.repo.getByEmail(newEmail);
    if (existingUser && existingUser.id !== userId) {
      return {
        success: false,
        message: 'Email already in use',
      };
    }

    // Update email
    const updated = await this.repo.updateEmail(userId, newEmail);

    // Optionally delete used OTP
    if (verification.otpRecord) {
      await this.otpRepo.deleteOtp(verification.otpRecord.id);
    }

    return {
      success: true,
      message: 'Email changed successfully',
      data: updated,
    };
  }
}

export const profileUseCase = new ProfileUseCase(profileRepository, profileOtpRepository);
