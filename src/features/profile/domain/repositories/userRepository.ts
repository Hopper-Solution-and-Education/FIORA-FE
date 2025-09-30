import { Prisma } from '@prisma/client';
import { UserBlocked } from '../entities/models/profile';
import { UserSearchResult } from '../entities/models/user.types';

export interface IUserRepository {
  getWithFilters(
    whereClause: Prisma.UserWhereInput,
    skip: number,
    limit: number,
  ): Promise<UserSearchResult[]>;
  blockUser(blockUserId: string, userId: string): Promise<UserBlocked | null>;
  getUserIdById(id: string): Promise<string | null>;
  isUserBlocked(userId: string): Promise<boolean>;
}
