import { normalizeToArray } from '@/shared/utils/filterUtils';
import { KYCStatus, Prisma, UserRole } from '@prisma/client';
import { UserBlocked, UserMyProfile } from '../../domain/entities/models/profile';
import {
  UserFilterParams,
  UserSearchResult,
  UserSearchResultCS,
} from '../../domain/entities/models/user.types';
import { IUserRepository } from '../../domain/repositories/userRepository';
import { userRepository } from '../../infrastructure/repositories/userRepository';

class UserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async getMyProfile(userId: string): Promise<UserMyProfile | null> {
    return this.userRepository.getMyProfile(userId);
  }
  async blockUser(blockUserId: string, userId: string): Promise<UserBlocked | null> {
    return this.userRepository.blockUser(blockUserId, userId);
  }
  async assignRole(
    assignUserId: string,
    role: UserRole,
    userId: string,
  ): Promise<UserBlocked | null> {
    return this.userRepository.assignRole(assignUserId, role, userId);
  }
  async getUserIdById(id: string): Promise<string | null> {
    return this.userRepository.getUserIdById(id);
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    return this.userRepository.isUserBlocked(userId);
  }
  async getCountUserEkycByStatus(eKycStatus: KYCStatus): Promise<number> {
    return this.userRepository.getCountUserEkycByStatus(eKycStatus);
  }
  async getAllUserEkycPending(
    params: UserFilterParams,
    userRole: UserRole,
  ): Promise<UserSearchResult[]> {
    const {
      search,
      status,
      role,
      fromDate,
      toDate,
      userFromDate,
      userToDate,
      email,
      page = 1,
      pageSize = 10,
    } = params;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(pageSize)));

    // Build filters
    const filters: Prisma.UserWhereInput = this.buildFilters(
      {
        search,
        status,
        role,
        email,
        fromDate,
        toDate,
        userFromDate,
        userToDate,
      },
      userRole,
    );

    const skip = (pageNum - 1) * limitNum;
    console.log('email', email);
    // Get data
    try {
      const result: UserSearchResult[] = await this.userRepository.getWithFilters(
        filters,
        skip,
        limitNum,
      );

      return result;
    } catch (error) {
      console.error('Error in getUsersUseCase:', error);
      console.error('Filters:', JSON.stringify(filters, null, 2));
      throw error;
    }
  }

  async getAllUserEkycPendingCS(
    params: UserFilterParams,
    userRole: UserRole,
  ): Promise<UserSearchResultCS[]> {
    const {
      search,
      status,
      fromDate,
      toDate,
      userFromDate,
      userToDate,
      email,
      page = 1,
      pageSize = 10,
    } = params;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(pageSize)));

    // Build filters
    const filters: Prisma.UserWhereInput = this.buildFilters(
      {
        search,
        status,
        email,
        fromDate,
        toDate,
        userFromDate,
        userToDate,
      },
      userRole,
    );

    const skip = (pageNum - 1) * limitNum;

    // Get data
    try {
      const result: UserSearchResultCS[] = await this.userRepository.getWithFiltersCS(
        filters,
        skip,
        limitNum,
      );

      return result;
    } catch (error) {
      console.error('Error in getUsersUseCase:', error);
      throw error;
    }
  }

  buildFilters(params: UserFilterParams, role: UserRole): Prisma.UserWhereInput {
    const filters: any = {
      eKYC: {
        some: { status: KYCStatus.PENDING },
        none: { status: { not: KYCStatus.PENDING } },
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

    if (params.email) {
      const emailArray = normalizeToArray(params.email as any);
      console.log('emailArray', emailArray);
      filters.email = { in: emailArray };
    }

    // Filter by role
    if (params.role && role === UserRole.Admin) {
      const roleArray = normalizeToArray(params.role as any);
      if (roleArray.length > 0) {
        filters.role = { in: roleArray };
      }
    }

    // Filter by status (isBlocked)
    if (params.status && role === UserRole.Admin) {
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

    // Filter by date range on eKYC createdAt
    if (params.fromDate || params.toDate) {
      if (!filters.eKYC.some.createdAt) {
        filters.eKYC.some.createdAt = {};
      }
      if (params.fromDate) {
        const fromDateObj = new Date(params.fromDate);
        if (!isNaN(fromDateObj.getTime())) {
          filters.eKYC.some.createdAt.gte = fromDateObj;
        }
      }
      if (params.toDate) {
        const toDateObj = new Date(params.toDate);
        if (!isNaN(toDateObj.getTime())) {
          filters.eKYC.some.createdAt.lte = toDateObj;
        }
      }
    }

    // Filter by date range on User createdAt
    if (params.userFromDate || params.userToDate) {
      filters.createdAt = {};
      if (params.userFromDate) {
        const userFromDateObj = new Date(params.userFromDate);
        if (!isNaN(userFromDateObj.getTime())) {
          filters.createdAt.gte = userFromDateObj;
        }
      }
      if (params.userToDate) {
        const userToDateObj = new Date(params.userToDate);
        if (!isNaN(userToDateObj.getTime())) {
          filters.createdAt.lte = userToDateObj;
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
