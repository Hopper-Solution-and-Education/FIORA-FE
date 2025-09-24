import { UserBlocked } from '../entities/models/profile';

export interface IBlockUserRepository {
  blockUser(blockUserId: string, userId: string): Promise<UserBlocked | null>;
  getUserIdById(id: string): Promise<string | null>;
  isUserBlocked(userId: string): Promise<boolean>;
}
