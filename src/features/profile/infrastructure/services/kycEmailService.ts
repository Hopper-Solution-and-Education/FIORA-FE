import { prisma } from '@/config';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { BadRequestError } from '@/shared/lib';
import { emailType, NotificationType } from '@prisma/client';

interface KYCEmailData {
  user_id: string;
  user_name: string;
  user_email: string;
  field_name: string;
  kyc_status: string;
  kyc_id: string;
  created_at: string;
  updated_at: string;
  verified_by: string;
  remarks?: string;
  document_number?: string;
  bank_account_number?: string;
}

interface KYCEmailPart {
  recipient: string;
  user_id: string;
  user_name: string;
  user_email: string;
  field_name: string;
  kyc_status: string;
  kyc_id: string;
  created_at: string;
  updated_at: string;
  verified_by: string;
  remarks?: string;
  document_number?: string;
  bank_account_number?: string;
}

export const sendKYCApprovedEmail = async (data: KYCEmailData): Promise<void> => {
  try {
    // 1. Get email template type for KYC_SUCCESSFUL
    const templateEmailType = await prisma.emailTemplateType.findFirst({
      where: {
        type: emailType.KYC_SUCCESSFUL,
      },
      select: {
        id: true,
      },
    });

    if (!templateEmailType) {
      throw new BadRequestError('KYC_SUCCESSFUL email template type not found');
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
      throw new BadRequestError('KYC_SUCCESSFUL email template not found');
    }

    // 3. Prepare email part
    const emailPart: KYCEmailPart = {
      recipient: data.user_email,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      field_name: data.field_name,
      kyc_status: data.kyc_status,
      kyc_id: data.kyc_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      verified_by: data.verified_by,
      remarks: data.remarks,
      document_number: data.document_number,
      bank_account_number: data.bank_account_number,
    };

    // 4. Send notification with template
    await notificationUseCase.sendNotificationWithTemplate(
      emailTemplate.id,
      [emailPart],
      NotificationType.PERSONAL,
      'KYC_APPROVAL',
      `KYC Verification Approved - ${data.field_name}`,
    );

    console.log(`KYC approved email sent to ${data.user_email}`);
  } catch (error) {
    console.error('Error sending KYC approved email:', error);
    throw error;
  }
};

export const sendKYCRejectedEmail = async (data: KYCEmailData): Promise<void> => {
  try {
    // 1. Get email template type for KYC_REJECT
    const templateEmailType = await prisma.emailTemplateType.findFirst({
      where: {
        type: emailType.KYC_REJECT,
      },
      select: {
        id: true,
      },
    });

    if (!templateEmailType) {
      throw new BadRequestError('KYC_REJECT email template type not found');
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
      throw new BadRequestError('KYC_REJECT email template not found');
    }

    // 3. Prepare email part
    const emailPart: KYCEmailPart = {
      recipient: data.user_email,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      field_name: data.field_name,
      kyc_status: data.kyc_status,
      kyc_id: data.kyc_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      verified_by: data.verified_by,
      remarks: data.remarks,
      document_number: data.document_number,
      bank_account_number: data.bank_account_number,
    };

    // 4. Send notification with template
    await notificationUseCase.sendNotificationWithTemplate(
      emailTemplate.id,
      [emailPart],
      NotificationType.PERSONAL,
      'KYC_REJECTION',
      `KYC Verification Rejected - ${data.field_name}`,
    );

    console.log(`KYC rejected email sent to ${data.user_email}`);
  } catch (error) {
    console.error('Error sending KYC rejected email:', error);
    throw error;
  }
};
