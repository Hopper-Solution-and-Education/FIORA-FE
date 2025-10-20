import { KYCStatus, Prisma, UserRole } from '@prisma/client';
import { UserAssignedRole, UserBlocked, UserMyProfile } from '../entities/models/profile';
import { EkycWithUser, EkycWithUserCS } from '../entities/models/user.types';

export interface IUserRepository {
  getWithFilters(
    whereClause: Prisma.eKYCWhereInput,
    skip: number,
    limit: number,
  ): Promise<EkycWithUser[]>;
  getWithFiltersCS(
    whereClause: Prisma.eKYCWhereInput,
    skip: number,
    limit: number,
  ): Promise<EkycWithUserCS[]>;
  blockUser(blockUserId: string, userId: string): Promise<UserBlocked | null>;
  getUserIdById(id: string): Promise<string | null>;
  isUserBlocked(userId: string): Promise<boolean>;
  assignRole(
    assignUserId: string,
    role: UserRole,
    userId: string,
  ): Promise<UserAssignedRole | null>;
  getCountUserEkycByStatus(eKycStatus: KYCStatus): Promise<number>;
  getMyProfile(userId: string): Promise<UserMyProfile | null>;
}
