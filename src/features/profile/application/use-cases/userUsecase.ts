import { normalizeToArray } from '@/shared/utils/filterUtils';
import { KYCStatus, Prisma } from '@prisma/client';
import { UserBlocked } from '../../domain/entities/models/profile';
import { UserFilterParams, UsersResponse } from '../../domain/entities/models/user.types';
import { IUserRepository } from '../../domain/repositories/userRepository';
import { userRepository } from '../../infrastructure/repositories/userRepository';

class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async blockUser(blockUserId: string, userId: string): Promise<UserBlocked | null> {
    return this.userRepository.blockUser(blockUserId, userId);
  }
  async getUserIdById(id: string): Promise<string | null> {
    return this.userRepository.getUserIdById(id);
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    return this.userRepository.isUserBlocked(userId);
  }
  async getAllUserEkycPending(params: UserFilterParams): Promise<UsersResponse> {
    const { search, role, status, fromDate, toDate, page = 1, pageSize = 10 } = params;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(pageSize)));

    // Build filters
    const filters: Prisma.UserWhereInput = this.buildFilters({
      search,
      role,
      status,
      fromDate,
      toDate,
    });

    const skip = (pageNum - 1) * limitNum;

    // Get data
    try {
      const result = await this.userRepository.getWithFilters(filters, skip, limitNum);

      return {
        users: result,
      };
    } catch (error) {
      console.error('Error in getUsersUseCase:', error);
      console.error('Filters:', JSON.stringify(filters, null, 2));
      throw error;
    }
  }
  buildFilters(params: UserFilterParams): Prisma.UserWhereInput {
    const filters: any = {
      eKYC: {
        some: {
          status: KYCStatus.PENDING,
        },
      },
    };

    if (params.search) {
      filters.OR = [
        {
          name: {
            contains: params.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: params.search,
            mode: 'insensitive',
          },
        },
      ];
    }

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

    if (params.status && !params.status.includes('all')) {
      if (params.status && params.status.includes('blocked')) {
        filters.isBlocked = { equals: true };
      } else if (params.status && params.status.includes('active')) {
        filters.isBlocked = { equals: false };
      }
    }
    return filters;
  }
}

export const userUseCase = new UserUseCase(userRepository);
