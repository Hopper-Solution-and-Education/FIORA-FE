import { prisma } from '@/config';
import { BadRequestError, NotFoundError } from '@/shared/lib';
import { Currency, Otp } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { ISendingWalletRepository } from '../../domain/interfaces/sendingWallet.interface';
import {
  ArgCreateOTP,
  ArgCreateTransactionSendingType,
  ArgGetPackageType,
  ArgVerifyOTP,
  MovingLimitType,
  ProductType,
  Reciever,
} from '../../domain/types/sendingWallet.type';

/**
 * Repository xử lý các thao tác với Prisma cho tính năng "Sending Wallet"
 * Bao gồm:
 *  - Lấy hạn mức chuyển tiền
 *  - Lấy số tiền đã chuyển
 *  - Gợi ý người nhận
 *  - Tạo và xác thực OTP
 *  - Thực hiện giao dịch gửi tiền
 */
class SendingWalletRepository implements ISendingWalletRepository {
  // Slug dùng để tìm benefit trong bảng membershipBenefit
  private _BENEFIT_DAILY_MOVING_SLUG = 'moving-daily-limit';
  private _BENEFIT_ONE_TIME_MOVING_SLUG = 'moving-1-time-limit';

  constructor(private _prisma = prisma) {}

  /**
   * Lấy hạn mức chuyển tiền (1 lần và trong ngày)
   */
  async getMovingLimit(userId: string): Promise<MovingLimitType> {
    // 1: Kiểm tra membership hiện tại của user
    const membershipProgress = await this._prisma.membershipProgress.findFirst({
      where: { userId },
    });
    if (!membershipProgress) throw new NotFoundError('Membership not found');
    if (!membershipProgress.tierId)
      throw new NotFoundError('Tier ID not found for membership progress');

    // 2: Lấy 2 loại benefit: daily & one-time
    const benefits = await this._prisma.membershipBenefit.findMany({
      where: {
        slug: { in: [this._BENEFIT_DAILY_MOVING_SLUG, this._BENEFIT_ONE_TIME_MOVING_SLUG] },
      },
    });

    const benefitDaily = benefits.find((b) => b.slug === this._BENEFIT_DAILY_MOVING_SLUG);
    const benefitOneTime = benefits.find((b) => b.slug === this._BENEFIT_ONE_TIME_MOVING_SLUG);
    if (!benefitDaily) throw new NotFoundError('Benefit daily moving limit not found');
    if (!benefitOneTime) throw new NotFoundError('Benefit one-time moving limit not found');

    // 3: Lấy giá trị của benefit cho tier hiện tại
    const tierBenefits = await this._prisma.tierBenefit.findMany({
      where: {
        tierId: membershipProgress.tierId,
        benefitId: { in: [benefitDaily.id, benefitOneTime.id] },
      },
    });

    const tierDaily = tierBenefits.find((tb) => tb.benefitId === benefitDaily.id);
    const tierOneTime = tierBenefits.find((tb) => tb.benefitId === benefitOneTime.id);
    if (!tierDaily) throw new NotFoundError('Benefit daily moving limit value not found');
    if (!tierOneTime) throw new NotFoundError('Benefit one-time moving limit value not found');

    // 4: Trả về limit dạng số và đơn vị tiền tệ
    return {
      dailyMovingLimit: {
        amount: tierDaily.value.toNumber(),
        currency: benefitDaily.suffix,
      },
      oneTimeMovingLimit: {
        amount: tierOneTime.value.toNumber(),
        currency: benefitOneTime.suffix,
      },
    };
  }

  /**
   * Tính tổng số tiền đã chuyển trong ngày từ ví Payment của user
   */
  async getMovedAmount(userId: string): Promise<number> {
    const paymentWallet = await this._prisma.wallet.findFirst({
      where: { type: 'Payment', userId },
      select: { id: true },
    });
    if (!paymentWallet) throw new NotFoundError('Payment wallet not found');

    // Tính tổng số tiền đã gửi trong ngày
    const result = await this._prisma.transaction.aggregate({
      where: {
        fromWalletId: paymentWallet.id,
        partnerId: { not: null },
        type: { in: ['Expense', 'Transfer'] },
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      _sum: { amount: true },
    });

    return result._sum.amount?.toNumber() ?? 0;
  }

  /**
   * Gợi ý danh sách người nhận (User hoặc Partner)
   * - Ưu tiên partner nếu email trùng
   * - Giới hạn 10 kết quả
   */
  async getRecommendReciever(query: string, userId: string): Promise<Reciever[]> {
    const receivers = await this._prisma.$queryRaw<Reciever[]>`
      SELECT DISTINCT ON (email) id, email, name, image, "isPartner"
      FROM (
          -- Partner
          SELECT 
              p.id, 
              p.email, 
              p.name, 
              p.logo AS image,
              true AS "isPartner"
          FROM "Partner" p
          WHERE p.email ILIKE '%' || ${query} || '%' 
            AND p."userId" = ${userId}::uuid

          UNION ALL

          -- User
          SELECT 
              u.id, 
              u.email, 
              u.name, 
              u."image" AS image,
              false AS "isPartner"
          FROM "User" u
          WHERE u.email ILIKE '%' || ${query} || '%' 
            AND u.id <> ${userId}::uuid
      ) results
      ORDER BY email, "isPartner" DESC
      LIMIT 10;
    `;
    return receivers ?? [];
  }

  /**
   * Lấy danh sách gói FX (theo hạn mức hiện tại)
   */
  async getPackageFX(data: ArgGetPackageType): Promise<number[]> {
    const { availableLimit } = data;

    const packageFXs = await this._prisma.packageFX.findMany({
      where: { fxAmount: { lte: availableLimit } },
      select: { fxAmount: true },
      orderBy: { fxAmount: 'asc' },
    });

    return packageFXs.map((pkg) => pkg.fxAmount.toNumber());
  }

  /**
   * Tạo OTP gửi FX - Giới hạn mỗi 2 phút mới được request lại
   */
  async createOTP(data: ArgCreateOTP): Promise<Otp> {
    const lastOtp = await this._prisma.otp.findFirst({
      where: { userId: data.userId, type: 'SENDING_FX' },
      orderBy: { createdAt: 'desc' },
    });

    // Nếu OTP gần nhất vẫn trong thời gian 2 phút --> không cho tạo mới
    if (lastOtp) {
      const twoMinutes = 2 * 60 * 1000;
      const expiresAt = new Date(lastOtp.createdAt.getTime() + twoMinutes);
      if (new Date() < expiresAt) {
        throw new BadRequestError('Please wait before requesting a new OTP');
      }
    }

    // Xoá OTP cũ
    await this._prisma.otp.deleteMany({
      where: { userId: data.userId, type: 'SENDING_FX' },
    });

    // Tạo OTP mới
    return this._prisma.otp.create({
      data: {
        ...data,
        id: crypto.randomUUID(),
        type: 'SENDING_FX',
      },
    });
  }

  /**
   * Xác thực OTP
   * - Kiểm tra tồn tại + hạn sử dụng + xóa sau khi xác thực
   */
  async verifyOTP(data: ArgVerifyOTP): Promise<void> {
    const { userId, otp } = data;

    const record = await this._prisma.otp.findFirst({
      where: { userId, otp, type: 'SENDING_FX' },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw new NotFoundError('Invalid OTP');

    // Check expired
    const expiresAt = new Date(record.createdAt.getTime() + Number(record.duration) * 1000);
    if (new Date() > expiresAt) throw new BadRequestError('OTP has expired');

    // OTP chỉ dùng 1 lần
    await this._prisma.otp.delete({ where: { id: record.id } });
  }

  /**
   * Tạo giao dịch gửi tiền (Expense cho sender, Income cho receiver)
   * - Kiểm tra ví, đối tác, hạn mức, số dư
   * - Tạo partner 2 chiều nếu chưa có
   * - Dùng Prisma transaction đảm bảo atomicity
   */
  async createTransactionSending(data: ArgCreateTransactionSendingType): Promise<any> {
    const { amount, recieverEmail, userId, categoryId, productIds } = data;
    const amountDecimal = new Decimal(amount);

    // Giao dịch transaction bảo toàn dữ liệu
    return this._prisma.$transaction(async (tx) => {
      // Kiểm tra category
      let category, products;
      if (categoryId) {
        category = await tx.category.findFirst({ where: { id: categoryId, userId } });
        if (!category) throw new NotFoundError('Category not found');
      }

      // Kiểm tra products
      if (productIds && productIds.length > 0) {
        products = await tx.product.findMany({
          where: { id: { in: productIds }, userId },
        });
        if (!products?.length) throw new NotFoundError('Products not found');
      }

      // Kiểm tra người gửi
      const sender = await tx.user.findFirst({
        where: { id: userId, isBlocked: false, isDeleted: false },
      });
      if (!sender) throw new BadRequestError('Sender not found');

      // Lấy ví người gửi
      const senderWallet = await tx.wallet.findFirst({
        where: { userId, type: 'Payment' },
      });
      if (!senderWallet) throw new NotFoundError('Sender wallet not found');

      if (senderWallet.frBalanceActive.lt(amountDecimal))
        throw new BadRequestError('Insufficient balance');

      // Lấy người nhận
      const receiver = await tx.user.findFirst({
        where: { email: recieverEmail, isBlocked: false, isDeleted: false },
      });
      if (!receiver) throw new NotFoundError('Receiver not found');

      // Lấy ví người nhận
      const receiverWallet = await tx.wallet.findFirst({
        where: { userId: receiver.id, type: 'Payment' },
      });
      if (!receiverWallet) throw new NotFoundError('Receiver wallet not found');

      // Tạo partner 2 chiều nếu chưa có
      let partnerReceiver = await tx.partner.findFirst({
        where: { email: recieverEmail, userId: sender.id },
      });
      if (!partnerReceiver) {
        partnerReceiver = await tx.partner.create({
          data: {
            email: receiver.email,
            name: receiver.name || receiver.email,
            logo: receiver.image,
            user: { connect: { id: sender.id } },
          },
        });
      }

      let partnerOfReceiver = await tx.partner.findFirst({
        where: { email: sender.email, userId: receiver.id },
      });
      if (!partnerOfReceiver) {
        partnerOfReceiver = await tx.partner.create({
          data: {
            email: sender.email,
            name: sender.name || sender.email,
            logo: sender.image,
            user: { connect: { id: receiver.id } },
          },
        });
      }

      // Cập nhật số dư 2 ví
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { frBalanceActive: { decrement: amountDecimal } },
      });
      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { frBalanceActive: { increment: amountDecimal } },
      });

      // Ghi transaction cho sender (Expense)
      const createdTxSending = await tx.transaction.create({
        data: {
          amount: amountDecimal,
          type: 'Expense',
          partnerId: partnerReceiver.id,
          userId: sender.id,
          fromWalletId: senderWallet.id,
          currency: Currency.FX,
          toCategoryId: category?.id,
          productsRelation: {
            create: products?.map((p) => ({
              product: { connect: { id: p.id } },
              createdBy: sender.id,
            })),
          },
          isMarked: true,
          baseAmount: amountDecimal,
        },
      });

      // Ghi transaction cho receiver (Income)
      const createdTxIncome = await tx.transaction.create({
        data: {
          amount: amountDecimal,
          type: 'Income',
          partnerId: partnerOfReceiver.id,
          userId: receiver.id,
          toWalletId: receiverWallet.id,
          currency: Currency.FX,
          isMarked: true,
          baseAmount: amountDecimal,
        },
      });

      // Trả về kết quả 2 chiều
      return { expense: createdTxSending, income: createdTxIncome };
    });
  }

  /**
   * Lấy danh sách category (chỉ loại Expense)
   */
  async getCategories(userId: string) {
    return this._prisma.category.findMany({
      where: { userId, type: 'Expense' },
      select: { id: true, icon: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Lấy danh sách sản phẩm kèm category
   */
  async getProductions(userId: string): Promise<ProductType[]> {
    return this._prisma.product.findMany({
      where: { userId },
      select: {
        id: true,
        icon: true,
        name: true,
        category: {
          select: { id: true, icon: true, name: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}

export const sendingWalletRepository: ISendingWalletRepository = new SendingWalletRepository();
