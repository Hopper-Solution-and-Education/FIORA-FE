import { UserBlocked } from '../../domain/entities/models/profile';
import { IBlockUserRepository } from '../../domain/repositories/blockUserRepository';
import { blockUserRepository } from '../../infrastructure/repositories/blockUserRepository';

class BlockUserUseCase {
  constructor(private blockUserRepository: IBlockUserRepository) {}

  async blockUser(blockUserId: string, userId: string): Promise<UserBlocked | null> {
    return this.blockUserRepository.blockUser(blockUserId, userId);
  }
  async getUserIdById(id: string): Promise<string | null> {
    return this.blockUserRepository.getUserIdById(id);
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    return this.blockUserRepository.isUserBlocked(userId);
  }
}

export const blockUserUseCase = new BlockUserUseCase(blockUserRepository);
