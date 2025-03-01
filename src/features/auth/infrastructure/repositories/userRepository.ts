// infrastructure/repositories/userRepository.ts
import { User } from '@prisma/client';
import { IUserRepository } from '@/features/auth/domain/repositories/userRepository.interface';
import prisma from '@/infrastructure/database/prisma';
import bcrypt from 'bcrypt';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(user: { email: string; password: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return prisma.user.create({ data: { email: user.email, password: hashedPassword } });
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
