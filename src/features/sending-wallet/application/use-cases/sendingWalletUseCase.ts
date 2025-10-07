import { prisma } from '@/config';
import { BadRequestError, InternalServerError, NotFoundError } from '@/shared/lib';
import { generateSixDigitNumber } from '@/shared/utils/common';
import { emailType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { sendingWalletRepository } from '../../infrastructure/repositories/sendingWalletRepository';
import { emailService } from '../../infrastructure/services/emailService';

class SendingWalletUseCase {
  constructor(
    private _sendingRepo = sendingWalletRepository,
    private _emailService = emailService,
    private _prisma = prisma,
  ) {}

  async getLimitAmount(userId: string) {
    const { dailyMovingLimit, oneTimeMovingLimit } = await this._sendingRepo.getMovingLimit(userId);

    const movedAmount = await this._sendingRepo.getMovedAmount(userId);

    const availableLimit = Math.min(dailyMovingLimit.amount - movedAmount);

    const packageFXs = await this._sendingRepo.getPackageFX({
      availableLimit,
    });

    return {
      dailyMovingLimit,
      oneTimeMovingLimit,
      movedAmount: {
        amount: movedAmount,
        currency: dailyMovingLimit.currency,
      },
      availableLimit: {
        amount: availableLimit,
        currency: dailyMovingLimit.currency,
      },
      packageFXs,
    };
  }

  private async validateSendingRequest(params: {
    userId: string;
    amount: number;
    emailReceiver: string;
    otp?: string;
  }) {
    const { userId, amount, emailReceiver, otp } = params;
    if (!amount) throw new BadRequestError('Amount FX cannot be not empty');

    const amountDecimal = new Decimal(amount);

    // 1. Input check
    if (!emailReceiver) throw new BadRequestError('Receiver email cannot be empty');
    if (amountDecimal.lte(0)) throw new BadRequestError('Amount must be greater than 0');

    // 2. Verify OTP (nếu có)
    if (otp) {
      await this._sendingRepo.verifyOTP({ userId, otp });
    }

    // 3. Verify sender
    const sender = await this._prisma.user.findFirst({
      where: { id: userId, isBlocked: false, isDeleted: false },
    });
    if (!sender) throw new NotFoundError('Sender not found');

    const senderWallet = await this._prisma.wallet.findFirst({
      where: { userId, type: 'Payment' },
    });
    if (!senderWallet) throw new NotFoundError('Sender wallet not found');

    // 4. Verify receiver
    const receiver = await this._prisma.user.findFirst({
      where: { email: emailReceiver, isBlocked: false, isDeleted: false, NOT: { id: userId } },
    });

    if (!receiver) throw new NotFoundError('Receiver not found');

    const receiverWallet = await this._prisma.wallet.findFirst({
      where: { userId: receiver.id, type: 'Payment' },
    });
    if (!receiverWallet) throw new NotFoundError('Receiver wallet not found');

    // 5. Balance check
    if (senderWallet.frBalanceActive.lt(amountDecimal)) {
      throw new BadRequestError('Insufficient balance');
    }

    // 6. Limit check
    const { dailyMovingLimit, oneTimeMovingLimit } = await this._sendingRepo.getMovingLimit(userId);
    const dailyLimitDecimal = new Decimal(dailyMovingLimit.amount);
    const oneTimeLimitDecimal = new Decimal(oneTimeMovingLimit.amount);

    if (amountDecimal.gt(oneTimeLimitDecimal)) {
      throw new BadRequestError(`Exceeds one-time limit: ${oneTimeLimitDecimal.toString()}`);
    }

    const movedAmountDecimal = new Decimal(await this._sendingRepo.getMovedAmount(userId));
    if (movedAmountDecimal.add(amountDecimal).gt(dailyLimitDecimal)) {
      throw new BadRequestError(`Exceeds daily limit: ${dailyLimitDecimal.toString()}`);
    }

    return {
      amountDecimal,
      sender,
      receiver,
      senderWallet,
      receiverWallet,
      dailyLimitDecimal,
      oneTimeLimitDecimal,
    };
  }

  async getRecommendUser(query: string, userId: string) {
    return this._sendingRepo.getRecommendReciever(query, userId);
  }

  async getCatalog(userId: string) {
    const categories = await this._sendingRepo.getCategories(userId);
    const products = await this._sendingRepo.getProductions(userId);

    return {
      categories,
      products,
    };
  }

  async sendOTP(data: { userId: string; amount: number; emailReceiver: string }) {
    await this.validateSendingRequest(data);

    const user = await this._prisma.user.findFirst({
      where: {
        id: data.userId,
        isBlocked: false,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Tạo OTP
    const random6Digits = generateSixDigitNumber();

    await this._emailService.sendOtpEmail(
      user.email,
      random6Digits.toString(),
      String(data.amount),
      data.emailReceiver,
      user.name ?? user.email,
    );

    // Lưu OTP vào DB
    const otpCreated = await this._sendingRepo.createOTP({
      duration: '300',
      otp: random6Digits.toString(),
      userId: data.userId,
      type: 'SENDING_FX',
    });

    if (!otpCreated) {
      throw new InternalServerError('OTP create failure');
    }
  }

  async sumbitSendingFX(data: {
    userId: string;
    amount: number;
    otp: string;
    emailReciever: string;
  }) {
    const { userId, amount, otp, emailReciever } = data;

    if (!otp) throw new BadRequestError('OTP must not be empty');

    const { sender, receiver } = await this.validateSendingRequest({
      userId,
      amount,
      emailReceiver: emailReciever,
      otp,
    });

    const { expense, income } = await this._sendingRepo.createTransactionSending({
      amount,
      recieverEmail: emailReciever,
      userId,
    });

    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(Number(amount))
      .toString();

    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: currentTimeZone,
      timeZoneName: 'short',
    }).format(new Date(expense.createdAt));

    const formattedDateReceiver = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: currentTimeZone,
      timeZoneName: 'short',
    }).format(new Date(income.createdAt));

    // send notification
    // To sender
    await this._emailService.sendNotificationEmail(sender.email, {
      userName: sender.name ?? sender.email,
      amount: formattedAmount,
      date: formattedDate.toString(),
      emailReceiver: receiver.email,
      isSender: true,
      receiverName: receiver?.name ?? receiver?.email,
    });

    await this._sendingRepo.createNotificationInbox({
      message: `You have successfully transferred ${formattedAmount} FX to ${receiver.email} on ${formattedDate}.`,
      notifyTo: 'PERSONAL',
      title: 'Transfer Completed Successfully',
      type: emailType.SENDING_SUCCESSFUL,
      emails: [sender.email],
      deepLink: '/wallet/payment',
    });

    // to reciver
    // To sender
    await this._emailService.sendNotificationEmail(receiver.email, {
      userName: sender.name ?? sender.email,
      amount: formattedAmount,
      date: formattedDateReceiver.toString(),
      emailReceiver: receiver.email,
      isSender: false,
      receiverName: receiver?.name ?? receiver?.email,
    });

    await this._sendingRepo.createNotificationInbox({
      message: `You have received ${formattedAmount} FX from ${sender.email} on ${formattedDateReceiver}.`,
      notifyTo: 'PERSONAL',
      title: 'Payment Received Successfully',
      type: emailType.SENDING_SUCCESSFUL,
      emails: [receiver.email],
      deepLink: '/wallet/payment',
    });
  }
}

export const sendingWalletUseCase = new SendingWalletUseCase();
