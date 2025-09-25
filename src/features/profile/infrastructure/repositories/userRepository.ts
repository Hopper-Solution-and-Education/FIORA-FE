import prisma from '@/config/prisma/prisma';
import { normalizeToArray } from '@/shared/utils/filterUtils';
import { KYCStatus } from '@prisma/client';
import { UserFilterParams, UserSearchResult } from '../../domain/entities/models/user.types';
import { UserRepositoryInterface } from '../../domain/repositories/userRepository.interface';

export class UserRepository implements UserRepositoryInterface {
  async getWithFilters(filters: any, skip: number, limit: number): Promise<UserSearchResult[]> {
    const whereClause: any = {
      isDeleted: false,
      ...filters,
    };

    // Add eKYC pending filter if requested
    whereClause.eKYC = {
      some: {
        status: KYCStatus.PENDING,
      },
    };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        updatedAt: true,
        avatarId: true,
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

  async searchFilter(search: string): Promise<any> {
    if (!search || search.trim() === '') {
      return null;
    }

    const searchTerm = search.trim();

    return {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          role: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  async buildFilters(params: UserFilterParams): Promise<any> {
    const filters: any = {};

    // Filter by role
    if (params.role) {
      const roleArray = normalizeToArray(params.role as any);
      if (roleArray.length > 0) {
        filters.role = { in: roleArray };
      }
    }

    // Filter by status (isBlocked)
    if (params.status) {
      const statusArray = normalizeToArray(params.status as any);
      const validStatuses = ['active', 'blocked'];
      const filteredStatuses = statusArray.filter((s) => validStatuses.includes(s));

      if (filteredStatuses.length > 0) {
        if (filteredStatuses.includes('active') && filteredStatuses.includes('blocked')) {
          // Include both active and blocked users
        } else if (filteredStatuses.includes('active')) {
          filters.isBlocked = { in: [false, null] };
        } else if (filteredStatuses.includes('blocked')) {
          filters.isBlocked = true;
        }
      }
    }

    // Filter by date range
    if (params.fromDate || params.toDate) {
      filters.createdAt = {};
      if (params.fromDate) {
        const fromDateObj = new Date(params.fromDate);
        if (!isNaN(fromDateObj.getTime())) {
          filters.createdAt.gte = fromDateObj;
        }
      }
      if (params.toDate) {
        const toDateObj = new Date(params.toDate);
        if (!isNaN(toDateObj.getTime())) {
          filters.createdAt.lte = toDateObj;
        }
      }
    }

    return filters;
  }
}

// Export instance for backward compatibility
export const userRepository = new UserRepository();
