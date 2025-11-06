import { prisma } from '@/config';
import { BadRequestError, InternalServerError, NotFoundError } from '@/shared/lib';
import { generateSixDigitNumber } from '@/shared/utils/common';
import { Decimal } from '@prisma/client/runtime/library';
import {
  CategoryType,
  DeepLink,
  Duration,
  LocaleFormat,
  OTPType,
  WalletType,
} from '../../constants/sendingWalletConstants';
import { SendingWalletMessage } from '../../constants/sendingWalletMessage';
import { sendingWalletRepository } from '../../infrastructure/repositories/sendingWalletRepository';
import { emailService } from '../../infrastructure/services/emailService';

class SendingWalletUseCase {
  constructor(
    private _sendingRepo = sendingWalletRepository, // Repository (Data layer)
    private _emailService = emailService, // Email service
    private _prisma = prisma, // Prisma client
  ) {}

  /**
   * Retrieve FX sending limit information for a user
   */
  async getLimitAmount(userId: string) {
    const { dailyMovingLimit, oneTimeMovingLimit } = await this._sendingRepo.getMovingLimit(userId);
    const movedAmount = await this._sendingRepo.getMovedAmount(userId);

    const availableLimit =
      dailyMovingLimit.amount - movedAmount > 0 ? dailyMovingLimit.amount - movedAmount : 0;

    const packageFXs = await this._sendingRepo.getPackageFX({ availableLimit });

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

  /**
   * Validate FX sending request:
   *  - Validate input
   *  - Check sender and receiver existence
   *  - Validate balance and limits
   *  - Validate OTP (if any)
   */
  private async validateSendingRequest(params: {
    userId: string;
    amount: number;
    emailReceiver: string;
    otp?: string;
    productIds?: string[];
    categoryId?: string;
    description?: string;
  }) {
    const { userId, amount, emailReceiver, otp, productIds, categoryId, description } = params;

    if (!amount) throw new BadRequestError(SendingWalletMessage.AMOUNT_EMPTY);
    if (!emailReceiver) throw new BadRequestError(SendingWalletMessage.RECEIVER_EMAIL_EMPTY);

    const amountDecimal = new Decimal(amount);
    if (amountDecimal.lte(0)) throw new BadRequestError(SendingWalletMessage.AMOUNT_INVALID);

    // Validate sender and wallet
    const sender = await this._prisma.user.findFirst({
      where: { id: userId, isBlocked: false, isDeleted: false },
    });
    if (!sender) throw new NotFoundError(SendingWalletMessage.SENDER_NOT_FOUND);

    const senderWallet = await this._prisma.wallet.findFirst({
      where: { userId, type: WalletType.PAYMENT },
    });
    if (!senderWallet) throw new NotFoundError(SendingWalletMessage.SENDER_WALLET_NOT_FOUND);

    // Validate receiver and wallet
    const receiver = await this._prisma.user.findFirst({
      where: { email: emailReceiver, isBlocked: false, isDeleted: false, NOT: { id: userId } },
    });
    if (!receiver) throw new NotFoundError(SendingWalletMessage.RECEIVER_NOT_FOUND);

    const receiverWallet = await this._prisma.wallet.findFirst({
      where: { userId: receiver.id, type: WalletType.PAYMENT },
    });
    if (!receiverWallet) throw new NotFoundError(SendingWalletMessage.RECEIVER_WALLET_NOT_FOUND);

    // Check balance
    if (senderWallet.frBalanceActive.lt(amountDecimal))
      throw new BadRequestError(SendingWalletMessage.INSUFFICIENT_BALANCE);

    // Check limits
    const { dailyMovingLimit, oneTimeMovingLimit } = await this._sendingRepo.getMovingLimit(userId);
    const dailyLimitDecimal = new Decimal(dailyMovingLimit.amount);
    const oneTimeLimitDecimal = new Decimal(oneTimeMovingLimit.amount);

    if (amountDecimal.gt(oneTimeLimitDecimal))
      throw new BadRequestError(`${SendingWalletMessage.EXCEEDS_ONE_TIME_LIMIT}: ${oneTimeLimitDecimal}`);

    const movedAmountDecimal = new Decimal(await this._sendingRepo.getMovedAmount(userId));
    if (movedAmountDecimal.add(amountDecimal).gt(dailyLimitDecimal))
      throw new BadRequestError(`${SendingWalletMessage.EXCEEDS_DAILY_LIMIT}: ${dailyLimitDecimal}`);

    // Validate productIds
    if (productIds && productIds.length > 0) {
      const products = await this._prisma.product.findMany({
        where: { id: { in: productIds }, userId },
      });
      if (!products.length) throw new NotFoundError(SendingWalletMessage.PRODUCTS_NOT_FOUND);
    }

    // Validate category
    if (categoryId) {
      const category = await this._prisma.category.findFirst({
        where: { id: categoryId, userId, type: CategoryType.EXPENSE },
      });
      if (!category) throw new NotFoundError(SendingWalletMessage.CATEGORY_NOT_FOUND);
    }

    // Validate description length (≤150 words)
    if (typeof description === 'string' && description.trim()) {
      const wordCount = description.trim().split(/\s+/).length;
      if (wordCount > 150) throw new BadRequestError(SendingWalletMessage.DESCRIPTION_TOO_LONG);
    }

    if (otp) await this._sendingRepo.verifyOTP({ userId, otp });

    return { amountDecimal, sender, receiver, senderWallet, receiverWallet };
  }

  /**
   * Get user recommendations for receiver search
   */
  async getRecommendUser(query: string, userId: string) {
    return this._sendingRepo.getRecommendReceiver(query, userId);
  }

  /**
   * Fetch both categories and products belonging to the user
   */
  async getCatalog(userId: string) {
    const categories = await this._sendingRepo.getCategories(userId);
    const products = await this._sendingRepo.getProductions(userId);
    return { categories, products };
  }

  /**
   * Send OTP for FX confirmation via email
   */
  async sendOTP(data: { userId: string; amount: number; emailReceiver: string }) {
    await this.validateSendingRequest(data);

    const user = await this._prisma.user.findFirst({
      where: { id: data.userId, isBlocked: false, isDeleted: false },
    });
    if (!user) throw new NotFoundError(SendingWalletMessage.USER_NOT_FOUND);

    const otpCode = generateSixDigitNumber().toString();

    await this._emailService.sendOtpEmail(
      user.email,
      otpCode,
      String(data.amount),
      data.emailReceiver,
      user.name ?? user.email,
    );

    const otpCreated = await this._sendingRepo.createOTP({
      duration: Duration.OTP_5_MIN,
      otp: otpCode,
      userId: data.userId,
      type: OTPType.SENDING_FX,
    });

    if (!otpCreated) throw new InternalServerError(SendingWalletMessage.OTP_CREATE_FAILURE);
  }

  /**
   * Submit FX sending after OTP verification
   */
  async sumbitSendingFX(data: {
    userId: string;
    amount: number;
    otp: string;
    emailReceiver: string;
    categoryId?: string;
    productIds?: string[];
    description?: string;
  }) {
    const { userId, amount, otp, emailReceiver, categoryId, productIds, description } = data;
    if (!otp) throw new BadRequestError(SendingWalletMessage.OTP_EMPTY);

    const { sender, receiver } = await this.validateSendingRequest({
      userId,
      amount,
      emailReceiver,
      otp,
      categoryId,
      productIds,
      description,
    });

    const { expense, income } = await this._sendingRepo.createTransactionSending({
      amount,
      receiverEmail: emailReceiver,
      userId,
      categoryId,
      productIds,
      description,
    });

    const formattedAmount = new Intl.NumberFormat(LocaleFormat.DEFAULT, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatDate = (d: Date) =>
      new Intl.DateTimeFormat(LocaleFormat.DEFAULT, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: tz,
        timeZoneName: 'short',
      }).format(new Date(d));

    const formattedDate = formatDate(expense.createdAt);
    const formattedDateReceiver = formatDate(income.createdAt);

    // Notify sender
    await this._emailService.sendNotificationEmail(
      sender.email,
      {
        userName: sender.name ?? sender.email,
        amount: formattedAmount,
        date: formattedDate,
        emailReceiver: receiver.email,
        isSender: true,
        receiverName: receiver.name ?? receiver.email,
      },
      true,
      { deepLink: DeepLink.WALLET_PAYMENT },
    );

    // Notify receiver
    await this._emailService.sendNotificationEmail(
      receiver.email,
      {
        userName: sender.name ?? sender.email,
        amount: formattedAmount,
        date: formattedDateReceiver,
        emailReceiver: receiver.email,
        isSender: false,
        receiverName: receiver.name ?? receiver.email,
      },
      true,
      { deepLink: DeepLink.WALLET_PAYMENT },
    );
  }
}

export const sendingWalletUseCase = new SendingWalletUseCase();
