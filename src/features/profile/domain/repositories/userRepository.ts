import { KYCStatus, Prisma, UserRole } from '@prisma/client';
import { UserAssignedRole, UserBlocked } from '../entities/models/profile';
import { UserSearchResult, UserSearchResultCS } from '../entities/models/user.types';

export interface IUserRepository {
  getWithFilters(
    whereClause: Prisma.UserWhereInput,
    skip: number,
    limit: number,
  ): Promise<UserSearchResult[]>;
  getWithFiltersCS(
    whereClause: Prisma.UserWhereInput,
    skip: number,
    limit: number,
  ): Promise<UserSearchResultCS[]>;
  blockUser(blockUserId: string, userId: string): Promise<UserBlocked | null>;
  getUserIdById(id: string): Promise<string | null>;
  isUserBlocked(userId: string): Promise<boolean>;
  assignRole(
    assignUserId: string,
    role: UserRole,
    userId: string,
  ): Promise<UserAssignedRole | null>;
  getCountUserEkycByStatus(eKycStatus: KYCStatus): Promise<number>;
}
