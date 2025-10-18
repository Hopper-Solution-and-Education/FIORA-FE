import {
  userRepository as UserRepository,
  userRepository,
} from '@/features/auth/infrastructure/repositories/userRepository';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { EmailTemplateEnum } from '@/shared/constants/EmailTemplateEnum';
import { BadRequestError } from '@/shared/lib';
import { NotificationType } from '@prisma/client';
import bcrypt from 'bcrypt';

export class ReNewPasswordUseCase {
  constructor(
    private userRepository: typeof UserRepository,
    private notificationUseCase: any,
  ) {}

  async resetPassword(email: string, newPassword: string) {
    try {
      newPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await this.userRepository.updatePassword(email, newPassword);
      return updatedUser;
    } catch (error: any) {
      throw new BadRequestError('Failed to reset password: ', error);
    }
  }

  async sendOtpForgotPassword(email: string, otp: string) {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new BadRequestError('User not found');
      }

      // Prepare email data with template variables
      const emailParts = [
        {
          user_id: user.id,
          recipient: email,
          user_name: user.name || 'User',
          field_name: 'password reset',
          OTP_code: otp,
          user_email: email,
        },
      ];

      // Send notification with template
      const result = await this.notificationUseCase.sendNotificationWithTemplate(
        EmailTemplateEnum.OTP_VERIFICATION,
        emailParts,
        NotificationType.PERSONAL,
        'OTP',
        'OTP Verification Required - FIORA',
      );

      console.log(result);

      return result;
    } catch (error: any) {
      throw new BadRequestError(`Failed to send OTP: ${error.message}`);
    }
  }
}

const reNewPasswordUseCase = new ReNewPasswordUseCase(userRepository, notificationUseCase);
export default reNewPasswordUseCase;
