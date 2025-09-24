import { UserBlocked } from '../entities/models/profile';

export interface IAssignUserRoleRepository {
  assignUserRole(blockUserId: string, userId: string): Promise<UserBlocked | null>;
  getUserIdById(id: string): Promise<string | null>;
  isUserRole(userId: string): Promise<boolean>;
}
