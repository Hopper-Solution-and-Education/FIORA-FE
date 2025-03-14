import bcrypt from 'bcrypt';

import { User } from '@prisma/client';
import { IUserRepository } from '../../domain/repositories/userRepository.interface';
import { ConflictError } from '@/config/errors';
import { userRepository } from '../../infrastructure/repositories/userRepository';

class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<User> {
    const userFound = await this.userRepository.findByEmail(email);
    if (userFound) {
      throw new ConflictError('Email đã tồn tại');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRepository.createUser({ email, hashedPassword });
  }

  async verifyEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async checkExistedUserById(id: string): Promise<User | null> {
    return this.userRepository.checkIsExistedUserById(id);
  }

  async verifyUser(email: string): Promise<User> {
    return this.userRepository.verifyUser(email);
  }
}

export const UserUSeCaseInstance = new UserUseCase(userRepository);
