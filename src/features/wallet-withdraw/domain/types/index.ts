import { EmailPart } from '@/features/notification/application/use-cases/notificationUseCase';

export interface WalletWithDrawOTP extends EmailPart {
  otp: number | string;
  bankAccountNumber: string;
  bankAccountName: string;
}
