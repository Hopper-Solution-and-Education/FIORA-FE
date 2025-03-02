import { UserRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import { User } from '@prisma/client';

export class SignUpUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, hashedPassword: string): Promise<void> {
    await this.userRepository.createUser({ email, hashedPassword });
  }

  async verifyEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async verifyUser(email: string): Promise<User> {
    return this.userRepository.verifyUser(email);
  }
}
