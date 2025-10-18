import { prisma } from '@/config';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { InternalServerError, NotFoundError } from '@/shared/lib';
import { emailType } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';
import { IEmailService } from '../../domain/interfaces/sendOTP.interface';

class EmailService implements IEmailService {
  constructor(
    private _repo = prisma,
    private _notificationUsecase = notificationUseCase,
  ) {
    if (!process.env.SENDGRID_API_KEY) {
      throw new InternalServerError('SENDGRID_API_KEY is not set');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  private async loadEmailTemplate(file: string, type: emailType, name: string) {
    try {
      let templateEntity = await this._repo.emailTemplate.findFirst({
        where: {
          EmailTemplateType: { type },
        },
        include: { EmailTemplateType: true },
      });

      let template = templateEntity?.content;

      if (!template) {
        const filePath = path.join(
          process.cwd(),
          'src/features/sending-wallet/infrastructure/templates',
          file,
        );

        if (!fs.existsSync(filePath)) {
          throw new Error(`Template file not found: ${filePath}`);
        }

        template = fs.readFileSync(filePath, 'utf8');

        let templateType = await this._repo.emailTemplateType.findFirst({
          where: { type },
        });

        if (!templateType) {
          templateType = await this._repo.emailTemplateType.create({
            data: {
              type,
              createdAt: new Date(),
            },
          });
        }

        templateEntity = await this._repo.emailTemplate.create({
          data: {
            name,
            content: template,
            isActive: true,
            isdefault: true,
            emailtemplatetypeid: templateType.id,
          },
          include: { EmailTemplateType: true },
        });
      }

      return templateEntity;
    } catch (err) {
      throw new InternalServerError(`Failed to load template: ${(err as Error).message}`);
    }
  }

  async sendOtpEmail(
    to: string,
    otp: string,
    amount: string,
    emailReceiver: string,
    userName: string,
  ) {
    try {
      const userReceiver = await this._repo.user.findFirst({
        where: { email: to, isDeleted: false },
        select: { id: true, email: true },
      });

      if (!userReceiver) throw new NotFoundError('User receive email not found');

      const variables = { otp, amount, emailReceiver, userName };

      const templateEntity = await this.loadEmailTemplate(
        'otp.html',
        'SENDING_OTP',
        'Sending FX OTP',
      );

      await this._notificationUsecase.sendNotificationWithTemplate(
        templateEntity?.id as string,
        [
          {
            user_id: userReceiver.id,
            recipient: userReceiver.email,
            ...variables,
          },
        ],
        'PERSONAL',
        emailType.SENDING_OTP,
        'Confirm Your Transfer - FIORA',
      );
    } catch (err) {
      console.error('Send OTP email failed:', err);
      throw new InternalServerError(`Failed to send OTP email: ${(err as Error).message}`);
    }
  }

  async sendNotificationEmail(
    to: string,
    variables: {
      userName: string; // người gửi
      receiverName: string; // người nhận (hiển thị trên email)
      emailReceiver: string; // email người nhận
      date: string;
      amount: string;
      isSender: boolean; // true nếu là người gửi
    },
    isSendInBox?: boolean,
    sendInBoxProps?: {
      deepLink?: string;
      attachmentId?: string;
    },
  ) {
    try {
      const userReceiver = await this._repo.user.findFirst({
        where: { email: to, isDeleted: false },
        select: { id: true, email: true },
      });

      if (!userReceiver) throw new NotFoundError('User receive email not found');

      const isSender = variables.isSender;
      const { userName, receiverName, emailReceiver, date, amount } = variables;
      let newVariables: Record<string, string> = {
        userName,
        receiverName,
        emailReceiver,
        date,
        amount,
      };

      if (isSender) {
        newVariables = {
          ...newVariables,
          subject: 'Transfer Receipt',
          alertMessage: 'Transaction Completed — Your transfer was successful!',
          introMessage: `Dear ${userName}, your transfer has been successfully processed.`,
          labelFrom: 'Sender',
          labelTo: 'Receiver Email',
          amountLabel: 'Total',
          mainMessage: 'The amount has been securely transferred to the recipient’s account.',
          noteMessage:
            'Keep this receipt for your records. If you did not recognize this transaction, please contact',
        };
      } else {
        newVariables = {
          ...newVariables,
          subject: 'Payment Notification',
          alertMessage: 'You’ve received a new payment!',
          introMessage: `Dear ${receiverName}, you’ve received a payment from ${userName}.`,
          labelFrom: 'From',
          labelTo: 'To (Your Account)',
          amountLabel: 'Total',
          mainMessage: 'The amount has been securely credited to your account.',
          noteMessage: 'If you did not expect this payment, please contact',
        };
      }

      const templateEntity = await this.loadEmailTemplate(
        'notification.html',
        'SENDING_SUCCESSFUL',
        'Sending successful',
      );

      await this._notificationUsecase.sendNotificationWithTemplate(
        templateEntity?.id as string,
        [
          {
            user_id: userReceiver.id,
            recipient: userReceiver.email,
            ...newVariables,
          },
        ],
        'PERSONAL',
        emailType.SENDING_SUCCESSFUL,
        isSender ? 'Transfer Receipt - FIORA' : 'Payment Notification - FIORA',
      );

      if (isSendInBox) {
        await this._notificationUsecase.createNotificationWithTemplate({
          emailParts: [
            {
              recipient: userReceiver.email,
              user_id: userReceiver.id,
              ...newVariables,
            },
          ],
          emailTemplateId: templateEntity?.id as string,
          notifyTo: 'PERSONAL',
          title: isSender ? 'Transfer Completed Successfully' : 'Payment Received Successfully',
          type: emailType.SENDING_SUCCESSFUL,
          message: isSender
            ? `Your transfer of ${amount} FX to ${receiverName} has been successfully completed.`
            : `You have received ${amount} FX from ${userName}.`,
          deepLink: sendInBoxProps?.deepLink,
          attachmentId: sendInBoxProps?.attachmentId,
          emails: [userReceiver.email],
          subject: isSender ? 'Transfer Receipt - FIORA' : 'Payment Notification - FIORA',
        });
      }
    } catch (err) {
      console.error('Send notification email failed:', err);
      throw new InternalServerError(`Failed to send notification email: ${(err as Error).message}`);
    }
  }
}

export const emailService = new EmailService();
