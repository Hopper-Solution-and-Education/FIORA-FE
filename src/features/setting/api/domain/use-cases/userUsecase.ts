import { User } from '@prisma/client';
import { userRepository } from '../../infrastructure/repositories/userRepository';
import { IUserRepository } from '../../repositories/userRepository.interface';

class UserUseCase {
  constructor(private _userRepository: IUserRepository = userRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return this._userRepository.findUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this._userRepository.findUserByEmail(email);
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    return this._userRepository.findUsersByIds(ids);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this._userRepository.updateUser(id, data);
  }
}

export const userUseCase = new UserUseCase();
