import { prisma } from '@/config';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { InternalServerError, NotFoundError } from '@/shared/lib';
import { emailType } from '@prisma/client';
import { IEmailService } from '../../domain/interfaces/sendOTP.interface';

class EmailService implements IEmailService {
  constructor(
    private _repo = prisma, // Prisma ORM instance
    private _notificationUsecase = notificationUseCase, // Use case for sending notifications
  ) {}

  /**
   * loadEmailTemplate
   * -----------------
   * Retrieves an email template from the database by its type.
   * Throws an error if the template does not exist.
   */
  private async loadEmailTemplate(type: emailType) {
    try {
      const templateEntity = await this._repo.emailTemplate.findFirst({
        where: {
          EmailTemplateType: { type },
          isActive: true,
        },
        include: { EmailTemplateType: true },
      });

      if (!templateEntity) {
        throw new NotFoundError(`Email template not found for type: ${type}`);
      }

      return templateEntity;
    } catch (err) {
      throw new InternalServerError(`Failed to load email template: ${(err as Error).message}`);
    }
  }

  /**
   * sendOtpEmail
   * -------------
   * Sends an OTP email for transaction confirmation.
   *
   * Parameters:
   * - `to`: recipient’s email address (user who will receive the OTP)
   * - `otp`: one-time password (6-digit code)
   * - `amount`: transaction amount
   * - `emailReceiver`: the email of the FX receiver (shown in the email body)
   * - `userName`: name of the sender (FX initiator)
   */
  async sendOtpEmail(
    to: string,
    otp: string,
    amount: string,
    emailReceiver: string,
    userName: string,
  ) {
    try {
      // Find the recipient user in the database
      const userReceiver = await this._repo.user.findFirst({
        where: { email: to, isDeleted: false },
        select: { id: true, email: true },
      });

      if (!userReceiver) throw new NotFoundError('User receiving email not found');

      // Variables to inject into the HTML template
      const variables = { otp, amount, emailReceiver, userName };

      // Load the OTP email template (type: SENDING_OTP)
      const templateEntity = await this.loadEmailTemplate('SENDING_OTP');

      // Use the notification use case to send the email via the notification system
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
        'Confirm Your Sending FX Transaction', // Email subject
      );
    } catch (err) {
      console.error('Send OTP email failed:', err);
      throw new InternalServerError(`Failed to send OTP email: ${(err as Error).message}`);
    }
  }

  /**
   * sendNotificationEmail
   * ---------------------
   * Sends a success notification email after a transaction is completed.
   * Can also create an in-app notification if `isSendInBox` is enabled.
   *
   * Parameters:
   * - `to`: recipient’s email
   * - `variables`: information used inside the email template
   * - `isSendInBox`: if true, also creates an in-app notification record
   * - `sendInBoxProps`: optional properties for in-app notification
   *    (deepLink, attachmentId, etc.)
   */
  async sendNotificationEmail(
    to: string,
    variables: {
      userName: string; // Sender name
      receiverName: string; // Receiver name (displayed in email)
      emailReceiver: string; // Receiver email
      date: string;
      amount: string;
      isSender: boolean; // True if this email is for the sender
    },
    isSendInBox?: boolean, // Whether to create an in-app notification
    sendInBoxProps?: {
      deepLink?: string; // Quick navigation link in app
      attachmentId?: string; // Optional file attachment
    },
  ) {
    try {
      // Find the email recipient in the database
      const userReceiver = await this._repo.user.findFirst({
        where: { email: to, isDeleted: false },
        select: { id: true, email: true },
      });

      if (!userReceiver) throw new NotFoundError('User receiving email not found');

      // Destructure template variables
      const isSender = variables.isSender;
      const { userName, receiverName, emailReceiver, date, amount } = variables;

      // Base variables used in both templates
      let newVariables: Record<string, string> = {
        userName,
        receiverName,
        emailReceiver,
        date,
        amount,
      };

      // Customize the content based on sender or receiver
      if (isSender) {
        newVariables = {
          ...newVariables,
          subject: 'Sending Receipt',
          alertMessage: 'Transaction Completed — Your sending was successful!',
          introMessage: `Dear ${userName}, your sending has been successfully processed.`,
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

      // Load the "transaction success" email template
      const templateEntity = await this.loadEmailTemplate('SENDING_SUCCESSFUL');

      // Send email via notification use case
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
        isSender ? 'Sending Receipt' : 'Payment Notification',
      );

      // Optionally create an in-app notification (Inbox)
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
          title: isSender ? 'Sending Completed Successfully' : 'Payment Received Successfully',
          type: emailType.SENDING_SUCCESSFUL,
          message: isSender
            ? `Your sending of ${amount} FX to ${receiverName} has been successfully completed.`
            : `You have received ${amount} FX from ${userName}.`,
          deepLink: sendInBoxProps?.deepLink,
          attachmentId: sendInBoxProps?.attachmentId,
          emails: [userReceiver.email],
          subject: isSender ? 'Sending Receipt' : 'Payment Notification',
        });
      }
    } catch (err) {
      console.error('Send notification email failed:', err);
      throw new InternalServerError(`Failed to send notification email: ${(err as Error).message}`);
    }
  }
}

// Export a singleton instance for use in other modules
export const emailService = new EmailService();
