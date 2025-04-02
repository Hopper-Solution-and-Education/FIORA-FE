import { userRepository as UserRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import bcrypt from 'bcrypt';

export class ReNewPasswordUseCase {
  constructor(private userRepository: typeof UserRepository) {}

  async resetPassword(email: string, newPassword: string) {
    try {
      newPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await this.userRepository.updatePassword(email, newPassword);
      return updatedUser;
    } catch (error: any) {
      throw new Error('Failed to reset password: ', error);
    }
  }
}
