import prisma from '@/config/prisma/prisma';
import { Prisma } from '@prisma/client';
import { UserBlocked } from '../../domain/entities/models/profile';
import { UserSearchResult } from '../../domain/entities/models/user.types';
import { IUserRepository } from '../../domain/repositories/userRepository';

export class UserRepository implements IUserRepository {
  async getUserIdById(id: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
    return user ? user.id : null;
  }
  async blockUser(blockUserId: string, userId: string): Promise<UserBlocked | null> {
    const userBlocked = await prisma.user.update({
      where: { id: blockUserId },
      data: {
        isBlocked: true,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        isBlocked: true,
      },
    });

    return userBlocked ? userBlocked : null;
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isBlocked: true,
      },
    });

    return user?.isBlocked === true;
  }
  async getWithFilters(
    whereClause: Prisma.UserWhereInput,
    skip: number,
    limit: number,
  ): Promise<UserSearchResult[]> {
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        kyc_levels: true,
        createdAt: true,
        updatedAt: true,
        avatarId: true,
        eKYC: {
          select: {
            id: true,
            status: true,
            method: true,
            type: true,
            fieldName: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return users.map((user) => ({
      ...user,
      role: user.role.toString(),
    }));
  }
}

// Export instance for backward compatibility
export const userRepository = new UserRepository();
