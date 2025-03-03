import { userRepository as UserRepository } from '@/features/auth/infrastructure/repositories/userRepository';

export class ReNewPasswordUseCase {
  constructor(private userRepository: typeof UserRepository) {}

  async resetPassword(email: string, newPassword: string) {
    try {
      // Gọi hàm updatePassword để cập nhật mật khẩu
      const updatedUser = await this.userRepository.updatePassword(email, newPassword);
      return updatedUser;
    } catch (error) {
      // Xử lý lỗi từ Prisma hoặc bcrypt
      throw new Error('Failed to reset password'); // Ném lỗi để caller xử lý
    }
  }
}
