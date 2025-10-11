import prisma from '@/config/prisma/prisma';
import { KYCStatus, Prisma, UserRole } from '@prisma/client';
import { UserAssignedRole, UserBlocked } from '../../domain/entities/models/profile';
import { UserSearchResult, UserSearchResultCS } from '../../domain/entities/models/user.types';
import { IUserRepository } from '../../domain/repositories/userRepository';

export class UserRepository implements IUserRepository {
  getCountUserEkycByStatus(eKycStatus: KYCStatus): Promise<number> {
    return prisma.user.count({
      where: {
        eKYC: {
          some: { status: eKycStatus },
          none: { status: { not: KYCStatus.PENDING } },
        },
      },
    });
  }
  async assignRole(
    assignUserId: string,
    role: UserRole,
    userId: string,
  ): Promise<UserAssignedRole | null> {
    const userBlocked = await prisma.user.update({
      where: { id: assignUserId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        isBlocked: true,
      },
      data: {
        updatedBy: userId,
        updatedAt: new Date(),
        role: role,
      },
    });
    return userBlocked ? userBlocked : null;
  }
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
    }));
  }

  async getWithFiltersCS(
    whereClause: Prisma.UserWhereInput,
    skip: number,
    limit: number,
  ): Promise<UserSearchResultCS[]> {
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
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
    }));
  }
}

// Export instance for backward compatibility
export const userRepository = new UserRepository();
