import { prisma } from '@/config';
import { BadRequestError, InternalServerError, NotFoundError } from '@/shared/lib';
import { generateSixDigitNumber } from '@/shared/utils/common';
import { Decimal } from '@prisma/client/runtime/library';
import { sendingWalletRepository } from '../../infrastructure/repositories/sendingWalletRepository';
import { emailService } from '../../infrastructure/services/emailService';

class SendingWalletUseCase {
  constructor(
    private _sendingRepo = sendingWalletRepository, // Repository (layer dữ liệu)
    private _emailService = emailService, // Dịch vụ gửi email
    private _prisma = prisma, // Prisma client (có thể dùng trực tiếp cho một vài logic)
  ) {}

  /**
   * Lấy thông tin hạn mức gửi tiền của người dùng
   * - Bao gồm: hạn mức ngày, hạn mức 1 lần, số tiền đã gửi, còn lại, và gói FX khả dụng
   */
  async getLimitAmount(userId: string) {
    // Lấy limit theo membership
    const { dailyMovingLimit, oneTimeMovingLimit } = await this._sendingRepo.getMovingLimit(userId);

    // Tổng số tiền đã chuyển trong ngày
    const movedAmount = await this._sendingRepo.getMovedAmount(userId);

    // Giới hạn còn lại trong ngày
    const availableLimit =
      dailyMovingLimit.amount - movedAmount > 0 ? dailyMovingLimit.amount - movedAmount : 0;

    // Các gói FX có thể gửi dựa trên limit còn lại
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

  /**
   * Kiểm tra toàn bộ điều kiện trước khi gửi tiền:
   *  - Kiểm tra input
   *  - Kiểm tra user, ví
   *  - Kiểm tra balance
   *  - Kiểm tra limit
   *  - Kiểm tra OTP (nếu có)
   */
  private async validateSendingRequest(params: {
    userId: string;
    amount: number;
    emailReceiver: string;
    otp?: string;
    productIds?: string[];
    categoryId?: string;
  }) {
    const { userId, amount, emailReceiver, otp, productIds, categoryId } = params;

    if (!amount) throw new BadRequestError('Amount FX cannot be not empty');
    if (!emailReceiver) throw new BadRequestError('Receiver email cannot be empty');

    const amountDecimal = new Decimal(amount);
    if (amountDecimal.lte(0)) throw new BadRequestError('Amount must be greater than 0');

    // Kiểm tra người gửi
    const sender = await this._prisma.user.findFirst({
      where: { id: userId, isBlocked: false, isDeleted: false },
    });
    if (!sender) throw new NotFoundError('Sender not found');

    const senderWallet = await this._prisma.wallet.findFirst({
      where: { userId, type: 'Payment' },
    });
    if (!senderWallet) throw new NotFoundError('Sender wallet not found');

    // Kiểm tra người nhận
    const receiver = await this._prisma.user.findFirst({
      where: { email: emailReceiver, isBlocked: false, isDeleted: false, NOT: { id: userId } },
    });
    if (!receiver) throw new NotFoundError('Receiver not found');

    const receiverWallet = await this._prisma.wallet.findFirst({
      where: { userId: receiver.id, type: 'Payment' },
    });
    if (!receiverWallet) throw new NotFoundError('Receiver wallet not found');

    // Kiểm tra số dư
    if (senderWallet.frBalanceActive.lt(amountDecimal))
      throw new BadRequestError('Insufficient balance');

    // Kiểm tra hạn mức
    const { dailyMovingLimit, oneTimeMovingLimit } = await this._sendingRepo.getMovingLimit(userId);
    const dailyLimitDecimal = new Decimal(dailyMovingLimit.amount);
    const oneTimeLimitDecimal = new Decimal(oneTimeMovingLimit.amount);

    // Một lần không vượt quá one-time limit
    if (amountDecimal.gt(oneTimeLimitDecimal))
      throw new BadRequestError(`Exceeds one-time limit: ${oneTimeLimitDecimal.toString()}`);

    // Tổng gửi trong ngày không vượt daily limit
    const movedAmountDecimal = new Decimal(await this._sendingRepo.getMovedAmount(userId));
    if (movedAmountDecimal.add(amountDecimal).gt(dailyLimitDecimal))
      throw new BadRequestError(`Exceeds daily limit: ${dailyLimitDecimal.toString()}`);

    // Kiểm tra sản phẩm (nếu có)
    if (productIds && productIds.length > 0) {
      const products = await this._prisma.product.findMany({
        where: { id: { in: productIds }, userId },
      });
      if (!products.length) throw new NotFoundError('Products not found');
    }

    // Kiểm tra category (nếu có)
    if (categoryId) {
      const category = await this._prisma.category.findFirst({
        where: { id: categoryId, userId, type: 'Expense' },
      });
      if (!category) throw new NotFoundError('Category not found');
    }

    // Verify OTP nếu có
    if (otp) await this._sendingRepo.verifyOTP({ userId, otp });

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

  /**
   * Gợi ý người nhận (partner/user)
   */
  async getRecommendUser(query: string, userId: string) {
    return this._sendingRepo.getRecommendReciever(query, userId);
  }

  /**
   * Lấy danh mục categories + products
   */
  async getCatalog(userId: string) {
    const categories = await this._sendingRepo.getCategories(userId);
    const products = await this._sendingRepo.getProductions(userId);

    return { categories, products };
  }

  /**
   * Gửi OTP xác nhận giao dịch
   * - Validate request trước khi gửi
   * - Tạo mã OTP 6 chữ số
   * - Gửi qua email + lưu DB
   */
  async sendOTP(data: { userId: string; amount: number; emailReceiver: string }) {
    await this.validateSendingRequest(data); // check cơ bản

    const user = await this._prisma.user.findFirst({
      where: { id: data.userId, isBlocked: false, isDeleted: false },
    });
    if (!user) throw new NotFoundError('User not found');

    // Tạo OTP ngẫu nhiên
    const random6Digits = generateSixDigitNumber();

    // Gửi email OTP
    await this._emailService.sendOtpEmail(
      user.email,
      random6Digits.toString(),
      String(data.amount),
      data.emailReceiver,
      user.name ?? user.email,
    );

    // Lưu OTP vào DB
    const otpCreated = await this._sendingRepo.createOTP({
      duration: '300', // 5 phút
      otp: random6Digits.toString(),
      userId: data.userId,
      type: 'SENDING_FX',
    });

    if (!otpCreated) throw new InternalServerError('OTP create failure');
  }

  /**
   * Thực hiện gửi FX sau khi người dùng nhập đúng OTP
   * - Xác minh OTP
   * - Tạo transaction 2 chiều (Expense + Income)
   * - Gửi email thông báo cho cả hai bên
   */
  async sumbitSendingFX(data: {
    userId: string;
    amount: number;
    otp: string;
    emailReciever: string;
    categoryId?: string;
    productIds?: string[];
  }) {
    const { userId, amount, otp, emailReciever, categoryId, productIds } = data;

    if (!otp) throw new BadRequestError('OTP must not be empty');

    // Xác minh dữ liệu + OTP
    const { sender, receiver } = await this.validateSendingRequest({
      userId,
      amount,
      emailReceiver: emailReciever,
      otp,
      categoryId,
      productIds,
    });

    // Tạo transaction gửi tiền
    const { expense, income } = await this._sendingRepo.createTransactionSending({
      amount,
      recieverEmail: emailReciever,
      userId,
      categoryId,
      productIds,
    });

    // Format số tiền và thời gian
    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));

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

    // Gửi email notification:
    // 1: Người gửi (sender)
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
      true, // gửi cả inbox notification
      { deepLink: '/wallet/payment' },
    );

    // 2: Người nhận (receiver)
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
      { deepLink: '/wallet/payment' },
    );
  }
}

export const sendingWalletUseCase = new SendingWalletUseCase();
