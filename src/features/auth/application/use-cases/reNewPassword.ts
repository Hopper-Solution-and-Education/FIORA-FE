import { prisma } from '@/config';
import {
  userRepository as UserRepository,
  userRepository,
} from '@/features/auth/infrastructure/repositories/userRepository';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { Messages } from '@/shared/constants';
import { BadRequestError } from '@/shared/lib';
import { emailType, NotificationType } from '@prisma/client';
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

      // 1. Get email template type for OTP
      const templateEmailType = await prisma.emailTemplateType.findFirst({
        where: {
          type: emailType.OTP,
        },
        select: {
          id: true,
        },
      });

      if (!templateEmailType) {
        throw new BadRequestError(Messages.EMAIL_TEMPLATE_NOT_FOUND);
      }

      // 2. Get email template
      const emailTemplate = await prisma.emailTemplate.findFirst({
        where: {
          emailtemplatetypeid: templateEmailType.id,
        },
        select: {
          id: true,
        },
      });

      if (!emailTemplate || !emailTemplate.id) {
        throw new BadRequestError(Messages.EMAIL_TEMPLATE_NOT_FOUND);
      }

      // Send notification with template
      const result = await this.notificationUseCase.sendNotificationWithTemplate(
        emailTemplate?.id,
        emailParts,
        NotificationType.PERSONAL,
        'OTP',
        'OTP Verification Required - FIORA',
      );

      return result;
    } catch (error: any) {
      throw new BadRequestError(`Failed to send OTP: ${error.message}`);
    }
  }
}

const reNewPasswordUseCase = new ReNewPasswordUseCase(userRepository, notificationUseCase);
export default reNewPasswordUseCase;
