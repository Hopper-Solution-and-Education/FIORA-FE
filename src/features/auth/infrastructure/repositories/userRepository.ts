// infrastructure/repositories/userRepository.ts
import { prisma } from '@/config';
import { IUserRepository } from '@/features/auth/domain/repositories/userRepository.interface';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(user: { email: string; hashedPassword: string }): Promise<User> {
    const data = prisma.user.create({
      data: {
        email: user.email,
        password: user.hashedPassword,
        emailVerified: true,
      },
    });
    if (!data) {
      throw new Error('Cannot create user');
    }
    return data;
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
}

export const userRepository = new UserRepository();
