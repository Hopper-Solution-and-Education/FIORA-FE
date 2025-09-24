import { UserBlocked } from '../../domain/entities/models/profile';
import { IAssignUserRoleRepository } from '../../domain/repositories/assignUserRoleRepository';

class BlockUserRepository implements IAssignUserRoleRepository {
  getUserIdById(id: string): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
  assignUserRole(blockUserId: string, userId: string): Promise<UserBlocked | null> {
    throw new Error('Method not implemented.');
  }
  isUserRole(userId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

export const blockUserRepository = new BlockUserRepository();
