// infrastructure/repositories/userRepository.ts
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { IUserRepository } from '@/features/auth/domain/repositories/userRepository.interface';
import prisma from '@/infrastructure/database/prisma';

class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(user: { email: string; hashedPassword: string }): Promise<User> {
    return prisma.user.create({
      data: { email: user.email, password: user.hashedPassword, emailVerified: true },
    });
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
      where: { email, emailVerified: true },
      data: { password: newPassword },
    });
  }
}

export const userRepository = new UserRepository();
