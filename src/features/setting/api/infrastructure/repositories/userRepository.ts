import prisma from '@/config/prisma/prisma';
import { User } from '@prisma/client';
import { IUserRepository } from '../../repositories/userRepository.interface';

class UserRepository implements IUserRepository {
  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUsersByIds(ids: string[]): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

export const userRepository = new UserRepository();
