import { prisma } from '@/config';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { InternalServerError, NotFoundError } from '@/shared/lib';
import { emailType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { IEmailService } from '../../domain/interfaces/sendOTP.interface';

class EmailService implements IEmailService {
  constructor(
    private _repo = prisma, // Prisma ORM instance
    private _notificationUsecase = notificationUseCase, // Use case gửi thông báo
  ) {}

  /**
   * Hàm loadEmailTemplate
   * - Lấy template email từ DB; nếu chưa có thì đọc từ file .html trong local rồi lưu vào DB.
   * - Giúp đảm bảo lần đầu chạy hệ thống vẫn có template mặc định để gửi.
   */
  private async loadEmailTemplate(file: string, type: emailType, name: string) {
    try {
      // Tìm template trong DB dựa theo loại email (type)
      let templateEntity = await this._repo.emailTemplate.findFirst({
        where: {
          EmailTemplateType: { type },
        },
        include: { EmailTemplateType: true },
      });

      // Nếu đã có template --> lấy nội dung ra
      let template = templateEntity?.content;

      // Nếu chưa có template trong DB --> đọc từ file local
      if (!template) {
        const filePath = path.join(
          process.cwd(),
          'src/features/sending-wallet/infrastructure/templates',
          file,
        );

        // Kiểm tra file có tồn tại không
        if (!fs.existsSync(filePath)) {
          throw new Error(`Template file not found: ${filePath}`);
        }

        // Đọc nội dung file HTML
        template = fs.readFileSync(filePath, 'utf8');

        // Tìm hoặc tạo mới emailTemplateType (bảng loại template)
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

        // Lưu template mới vào DB
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
      // Ném lỗi nếu có bất kỳ bước nào thất bại
      throw new InternalServerError(`Failed to load template: ${(err as Error).message}`);
    }
  }

  /**
   * Gửi email OTP khi người dùng xác nhận giao dịch
   * - `to`: email người nhận OTP
   * - `otp`: mã OTP
   * - `amount`: số tiền gửi
   * - `emailReceiver`: email người nhận tiền (hiển thị trong email)
   * - `userName`: tên người gửi
   */
  async sendOtpEmail(
    to: string,
    otp: string,
    amount: string,
    emailReceiver: string,
    userName: string,
  ) {
    try {
      // Tìm người nhận email trong DB
      const userReceiver = await this._repo.user.findFirst({
        where: { email: to, isDeleted: false },
        select: { id: true, email: true },
      });

      if (!userReceiver) throw new NotFoundError('User receive email not found');

      // Dữ liệu truyền vào template
      const variables = { otp, amount, emailReceiver, userName };

      // Load template HTML tương ứng loại email SENDING_OTP
      const templateEntity = await this.loadEmailTemplate(
        'otp.html',
        'SENDING_OTP',
        'Sending FX OTP',
      );

      // Gọi usecase để gửi email qua hệ thống notification
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
        'Confirm Your Sending FX Transaction', // tiêu đề email
      );
    } catch (err) {
      console.error('Send OTP email failed:', err);
      throw new InternalServerError(`Failed to send OTP email: ${(err as Error).message}`);
    }
  }

  /**
   * Gửi email thông báo khi giao dịch thành công (người gửi hoặc người nhận)
   * - Hỗ trợ cả gửi email và tạo notification trong hệ thống (isSendInBox)
   */
  async sendNotificationEmail(
    to: string,
    variables: {
      userName: string; // người gửi
      receiverName: string; // người nhận (hiển thị trong email)
      emailReceiver: string; // email người nhận
      date: string;
      amount: string;
      isSender: boolean; // true nếu là người gửi
    },
    isSendInBox?: boolean, // nếu true, sẽ tạo thêm notification trong hệ thống
    sendInBoxProps?: {
      deepLink?: string; // đường dẫn mở nhanh từ app
      attachmentId?: string; // file đính kèm nếu có
    },
  ) {
    try {
      // Lấy thông tin người nhận email
      const userReceiver = await this._repo.user.findFirst({
        where: { email: to, isDeleted: false },
        select: { id: true, email: true },
      });

      if (!userReceiver) throw new NotFoundError('User receive email not found');

      // Giải cấu trúc biến đầu vào
      const isSender = variables.isSender;
      const { userName, receiverName, emailReceiver, date, amount } = variables;

      // Dữ liệu cơ bản truyền vào template
      let newVariables: Record<string, string> = {
        userName,
        receiverName,
        emailReceiver,
        date,
        amount,
      };

      // Nếu là người gửi
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
        // Nếu là người nhận
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

      // Load template email thông báo thành công
      const templateEntity = await this.loadEmailTemplate(
        'notification.html',
        'SENDING_SUCCESSFUL',
        'Sending successful',
      );

      // Gửi email thông báo qua notification usecase
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

      // Nếu bật chế độ gửi vào hộp thư trong hệ thống (inbox)
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

// Export instance của service để dùng ở các module khác
export const emailService = new EmailService();
