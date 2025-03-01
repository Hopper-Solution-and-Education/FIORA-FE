import { UserRepository } from '@/features/auth/infrastructure/repositories/userRepository';

export class SignUpUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<void> {
    await this.userRepository.createUser({ email, password });
  }
}
