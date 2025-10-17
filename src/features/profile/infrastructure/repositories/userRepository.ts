import prisma from '@/config/prisma/prisma';
import { KYCStatus, Prisma, UserRole } from '@prisma/client';
import { UserAssignedRole, UserBlocked, UserMyProfile } from '../../domain/entities/models/profile';
import { EkycWithUser, EkycWithUserCS } from '../../domain/entities/models/user.types';
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
    whereClause: Prisma.eKYCWhereInput,
    skip: number,
    limit: number,
  ): Promise<EkycWithUser[]> {
    const ekycs = await prisma.eKYC.findMany({
      where: whereClause,
      select: {
        id: true,
        status: true,
        method: true,
        type: true,
        fieldName: true,
        createdAt: true,
        User: {
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
    const avatarIds = ekycs
      .map((ekyc) => ekyc.User?.avatarId)
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
    return ekycs
      .filter((ekyc) => ekyc.User) // Only include eKYCs with valid users
      .map((ekyc) => ({
        id: ekyc.id,
        status: ekyc.status,
        method: ekyc.method,
        type: ekyc.type,
        fieldName: ekyc.fieldName,
        createdAt: ekyc.createdAt,
        User: {
          id: ekyc.User!.id,
          name: ekyc.User!.name,
          email: ekyc.User!.email,
          role: ekyc.User!.role,
          isBlocked: ekyc.User!.isBlocked,
          kyc_levels: ekyc.User!.kyc_levels,
          createdAt: ekyc.User!.createdAt,
          updatedAt: ekyc.User!.updatedAt,
          avatarId: ekyc.User!.avatarId,
          avatarUrl: ekyc.User?.avatarId ? avatarMap.get(ekyc.User.avatarId) || null : null,
        },
      }));
  }

  async getWithFiltersCS(
    whereClause: Prisma.eKYCWhereInput,
    skip: number,
    limit: number,
  ): Promise<EkycWithUserCS[]> {
    const ekycs = await prisma.eKYC.findMany({
      where: whereClause,
      select: {
        id: true,
        status: true,
        method: true,
        type: true,
        fieldName: true,
        createdAt: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            kyc_levels: true,
            createdAt: true,
            updatedAt: true,
            avatarId: true,
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
    const avatarIds = ekycs
      .map((ekyc) => ekyc.User?.avatarId)
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
    return ekycs
      .filter((ekyc) => ekyc.User) // Only include eKYCs with valid users
      .map((ekyc) => ({
        id: ekyc.id,
        status: ekyc.status,
        method: ekyc.method,
        type: ekyc.type,
        fieldName: ekyc.fieldName,
        createdAt: ekyc.createdAt,
        User: {
          id: ekyc.User!.id,
          name: ekyc.User!.name,
          email: ekyc.User!.email,
          kyc_levels: ekyc.User!.kyc_levels,
          createdAt: ekyc.User!.createdAt,
          updatedAt: ekyc.User!.updatedAt,
          avatarId: ekyc.User!.avatarId,
          avatarUrl: ekyc.User?.avatarId ? avatarMap.get(ekyc.User.avatarId) || null : null,
        },
      }));
  }
}

// Export instance for backward compatibility
export const userRepository = new UserRepository();
