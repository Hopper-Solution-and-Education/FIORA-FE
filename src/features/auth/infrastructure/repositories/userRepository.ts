import { prisma } from '@/config';
import { IUserRepository } from '@/features/auth/domain/repositories/userRepository.interface';
import { buildReferralCodeCandidate, REFERRAL_CODE_MAX_ATTEMPTS } from '@/shared/utils/common';
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';

class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(user: { email: string; hashedPassword: string }): Promise<User> {
    for (let attempt = 0; attempt < REFERRAL_CODE_MAX_ATTEMPTS; attempt += 1) {
      const referralCode = await this.generateUniqueReferralCode();

      try {
        return await prisma.user.create({
          data: {
            email: user.email,
            password: user.hashedPassword,
            emailVerified: true,
            referral_code: referralCode,
          },
        });
      } catch (error) {
        if (this.isReferralCodeUniqueConstraintError(error)) {
          continue;
        }
        throw error;
      }
    }

    throw new Error('Cannot create user');
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async checkIsExistedUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }

  async verifyUser(email: string): Promise<User> {
    return prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });
  }

  async updatePassword(email: string, newPassword: string) {
    return prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  private async generateUniqueReferralCode(): Promise<string> {
    for (let attempt = 0; attempt < REFERRAL_CODE_MAX_ATTEMPTS; attempt += 1) {
      const code = buildReferralCodeCandidate();
      const existing = await prisma.user.findUnique({ where: { referral_code: code } });
      if (!existing) {
        return code;
      }
    }

    throw new Error('Failed to generate unique referral code');
  }

  private isReferralCodeUniqueConstraintError(error: unknown): boolean {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return false;
    }

    if (error.code !== 'P2002') {
      return false;
    }

    const target = error.meta?.target;
    if (Array.isArray(target)) {
      return target.includes('referral_code');
    }

    return typeof target === 'string' && target.includes('referral_code');
  }
}

export const userRepository = new UserRepository();
