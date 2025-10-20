import { NotificationType, Otp, Transaction } from '@prisma/client';
import {
  ArgCreateOTP,
  ArgCreateTransactionSendingType,
  ArgGetPackageType,
  ArgVerifyOTP,
  CategoryItemType,
  MovingLimitType,
  ProductType,
  Reciever,
} from '../types/sendingWallet.type';

export interface CreateNotificationInbox {
  title: string;
  type: string;
  notifyTo: NotificationType;
  attachmentId?: string;
  deepLink?: string;
  message: string;
  emails?: string[];
}

export interface ISendingWalletRepository {
  getMovingLimit(userId: string): Promise<MovingLimitType>;

  getMovedAmount(userId: string): Promise<number>;

  getRecommendReciever(query: string, userId: string): Promise<Reciever[]>;

  getPackageFX(data: ArgGetPackageType): Promise<number[]>;

  createOTP(data: ArgCreateOTP): Promise<Otp>;

  verifyOTP(data: ArgVerifyOTP): Promise<void>;

  createTransactionSending(data: ArgCreateTransactionSendingType): Promise<{
    expense: Transaction;
    income: Transaction;
  }>;

  getCategories(userId: string): Promise<CategoryItemType[]>;

  getProductions(userId: string): Promise<ProductType[]>;
}
