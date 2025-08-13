import { EmailPart } from '@/features/notification/application/use-cases/notificationUseCase';

// Fields match the email template variables exactly: {{user_name}}, {{user_email}}, {{fx_amount}}
export interface WalletApproveEmailPart extends EmailPart {
  user_name: string;
  user_email: string;
  fx_amount: number | string;
}

export interface WalletRejectEmailPart extends EmailPart {
  user_name: string;
  user_email: string;
  fx_amount: number | string;
  rejection_reason: string;
}
