import bcrypt from 'bcrypt';

import { UserRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import { User } from '@prisma/client';
import { ConflictError } from '@/lib/errors';

export class SignUpUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<User> {
    const userFound = await this.userRepository.findByEmail(email);
    if (userFound) {
      throw new ConflictError('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRepository.createUser({ email, hashedPassword });
  }

  async verifyEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async verifyUser(email: string): Promise<User> {
    return this.userRepository.verifyUser(email);
  }
}
