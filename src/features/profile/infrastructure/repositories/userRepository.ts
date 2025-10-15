import prisma from '@/config/prisma/prisma';
import { KYCStatus, Prisma, UserRole } from '@prisma/client';
import { UserAssignedRole, UserBlocked, UserMyProfile } from '../../domain/entities/models/profile';
import { UserSearchResult, UserSearchResultCS } from '../../domain/entities/models/user.types';
import { IUserRepository } from '../../domain/repositories/userRepository';

export class UserRepository implements IUserRepository {
  getMyProfile(userId: string): Promise<UserMyProfile | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        isBlocked: true,
      },
    });
  }
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
    const userBlocked = await prisma.$transaction(async (tx) => {
      // Lấy giá trị hiện tại
      const currentUser = await tx.user.findUnique({
        where: { id: blockUserId },
        select: { isBlocked: true },
      });

      // Toggle giá trị
      return await tx.user.update({
        where: { id: blockUserId },
        data: {
          isBlocked: !currentUser?.isBlocked,
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

    // Get all unique avatarIds that are not null
    const avatarIds = users
      .map((user) => user.avatarId)
      .filter((id): id is string => id !== null && id !== undefined);

    // Fetch avatars in one query if there are any avatarIds
    const avatars =
      avatarIds.length > 0
        ? await prisma.attachment.findMany({
            where: {
              id: {
                in: avatarIds,
              },
            },
            select: {
              id: true,
              url: true,
            },
          })
        : [];

    // Create a map for O(1) lookup
    const avatarMap = new Map(avatars.map((avatar) => [avatar.id, avatar.url]));

    // Merge avatar URLs with users
    return users.map((user) => ({
      ...user,
      avatarUrl: user.avatarId ? avatarMap.get(user.avatarId) || null : null,
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

    // Get all unique avatarIds that are not null
    const avatarIds = users
      .map((user) => user.avatarId)
      .filter((id): id is string => id !== null && id !== undefined);

    // Fetch avatars in one query if there are any avatarIds
    const avatars =
      avatarIds.length > 0
        ? await prisma.attachment.findMany({
            where: {
              id: {
                in: avatarIds,
              },
            },
            select: {
              id: true,
              url: true,
            },
          })
        : [];

    // Create a map for O(1) lookup
    const avatarMap = new Map(avatars.map((avatar) => [avatar.id, avatar.url]));

    // Merge avatar URLs with users
    return users.map((user) => ({
      ...user,
      avatarUrl: user.avatarId ? avatarMap.get(user.avatarId) || null : null,
    }));
  }
}

// Export instance for backward compatibility
export const userRepository = new UserRepository();
