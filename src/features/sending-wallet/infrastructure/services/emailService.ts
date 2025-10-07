import { prisma } from '@/config';
import { InternalServerError, NotFoundError } from '@/shared/lib';
import { ChannelType, emailType } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';
import { IEmailService } from '../../domain/interfaces/sendOTP.interface';

class EmailService implements IEmailService {
  constructor(private _repo = prisma) {
    if (!process.env.SENDGRID_API_KEY) {
      throw new InternalServerError('SENDGRID_API_KEY is not set');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  private async loadTemplate(
    file: string,
    variables: Record<string, string>,
    type: emailType,
    name: string,
  ) {
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

      for (const key in variables) {
        const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
        template = template.replace(regex, variables[key]);
      }

      return { htmlContent: template, templateEntity };
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
    const senderEmail = process.env.SENDER_EMAIL || 'noreply@fiora.com';

    try {
      const userReceiver = await this._repo.user.findFirst({
        where: { email: to, isDeleted: false },
        select: { id: true, email: true },
      });
      if (!userReceiver) throw new NotFoundError('User receive email not found');

      const { htmlContent, templateEntity } = await this.loadTemplate(
        'otp.html',
        { otp, amount, emailReceiver, userName },
        'SENDING_OTP',
        'Sending FX OTP',
      );

      const notification = await this._repo.notification.create({
        data: {
          title: 'Confirm Your Transfer - FIORA',
          message: htmlContent,
          channel: ChannelType.EMAIL,
          notifyTo: 'PERSONAL',
          type: emailType.SENDING_OTP,
          emails: [userReceiver.email],
          emailTemplateId: templateEntity?.id || null,
          createdBy: null,
        },
      });

      await this._repo.userNotification.create({
        data: {
          userId: userReceiver.id,
          notificationId: notification.id,
          isRead: false,
          createdBy: null,
        },
      });

      const msg = {
        to,
        from: senderEmail,
        subject: notification.title,
        html: htmlContent,
      };

      try {
        await sgMail.send(msg);

        await this._repo.emailNotificationLogs.create({
          data: {
            notificationId: notification.id,
            userId: userReceiver.id,
            status: 'SENT',
            errorMessage: null,
            createdBy: null,
          },
        });
      } catch (emailErr) {
        await this._repo.emailNotificationLogs.create({
          data: {
            notificationId: notification.id,
            userId: userReceiver.id,
            status: 'FAILED',
            errorMessage: (emailErr as Error).message ?? 'OTP sending failed',
            createdBy: null,
          },
        });

        throw new InternalServerError('Failed to send email via SendGrid');
      }

      return htmlContent;
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
  ) {
    const senderEmail = process.env.SENDER_EMAIL || 'noreply@fiora.com';

    try {
      const userReceiver = await this._repo.user.findFirst({
        where: { email: to, isDeleted: false },
        select: { id: true, email: true },
      });

      if (!userReceiver) throw new NotFoundError('User receive email not found');

      const isSender = variables.isSender;
      const { userName, receiverName, emailReceiver, date, amount } = variables;

      const { htmlContent: html, templateEntity } = await this.loadTemplate(
        'notification.html',
        {
          subject: isSender ? 'Transfer Receipt' : 'Payment Notification',
          alertMessage: isSender
            ? 'Transaction Completed — Your transfer was successful!'
            : 'You’ve received a new payment!',
          introMessage: isSender
            ? `Dear ${userName}, your transfer has been successfully processed.`
            : `Dear ${receiverName}, you’ve received a payment from ${userName}.`,
          labelFrom: isSender ? 'Sender' : 'From',
          labelTo: isSender ? 'Receiver Email' : 'To (Your Account)',
          amountLabel: isSender ? 'Total Debited' : 'Total Credited',
          mainMessage: isSender
            ? 'The amount has been securely transferred to the recipient’s account.'
            : 'The amount has been securely credited to your account.',
          noteMessage: isSender
            ? 'Keep this receipt for your records. If you did not recognize this transaction, please contact support@fiora.com.'
            : 'If you did not expect this payment, please contact support@fiora.com immediately.',
          userName,
          receiverName,
          emailReceiver,
          date,
          amount,
        },
        'SENDING_SUCCESSFUL',
        'Sending successful',
      );

      const notification = await this._repo.notification.create({
        data: {
          title: isSender ? 'Transfer Receipt - FIORA' : 'Payment Notification - FIORA',
          message: html,
          channel: ChannelType.EMAIL,
          notifyTo: 'PERSONAL',
          type: emailType.SENDING_SUCCESSFUL,
          emails: [userReceiver.email],
          emailTemplateId: templateEntity?.id,
          createdBy: null,
        },
      });

      await this._repo.userNotification.create({
        data: {
          userId: userReceiver.id,
          notificationId: notification.id,
          isRead: false,
          createdBy: null,
        },
      });

      const msg = {
        to,
        from: senderEmail,
        subject: isSender ? 'Transfer Receipt - FIORA' : 'Payment Notification - FIORA',
        html,
      };

      try {
        await sgMail.send(msg);

        await this._repo.emailNotificationLogs.create({
          data: {
            notificationId: notification.id,
            userId: userReceiver.id,
            status: 'SENT',
            errorMessage: null,
            createdBy: null,
          },
        });
      } catch (emailErr) {
        await this._repo.emailNotificationLogs.create({
          data: {
            notificationId: notification.id,
            userId: userReceiver.id,
            status: 'FAILED',
            errorMessage: (emailErr as Error).message ?? 'Email sending failed',
            createdBy: null,
          },
        });

        throw new InternalServerError('Failed to send email via SendGrid');
      }

      return html;
    } catch (err) {
      console.error('Send notification email failed:', err);
      throw new InternalServerError(`Failed to send notification email: ${(err as Error).message}`);
    }
  }
}

export const emailService = new EmailService();
