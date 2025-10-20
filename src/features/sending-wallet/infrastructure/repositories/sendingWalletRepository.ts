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

class SendingWalletRepository implements ISendingWalletRepository {
  private _BENEFIT_DAILY_MOVING_SLUG = 'moving-daily-limit';
  private _BENEFIT_ONE_TIME_MOVING_SLUG = 'moving-1-time-limit';

  constructor(private _prisma = prisma) {}

  async getMovingLimit(userId: string): Promise<MovingLimitType> {
    // Lấy thông tin membership của user
    const membershipProgress = await this._prisma.membershipProgress.findFirst({
      where: { userId },
    });

    if (!membershipProgress) {
      throw new NotFoundError('Membership not found');
    }

    if (!membershipProgress.tierId) {
      throw new NotFoundError('Tier ID not found for membership progress');
    }

    // Lấy 2 benefit theo slug (daily, one-time)
    const benefits = await this._prisma.membershipBenefit.findMany({
      where: {
        slug: { in: [this._BENEFIT_DAILY_MOVING_SLUG, this._BENEFIT_ONE_TIME_MOVING_SLUG] },
      },
    });

    const benefitDaily = benefits.find((b) => b.slug === this._BENEFIT_DAILY_MOVING_SLUG);
    const benefitOneTime = benefits.find((b) => b.slug === this._BENEFIT_ONE_TIME_MOVING_SLUG);

    if (!benefitDaily) throw new NotFoundError('Benefit daily moving limit not found');
    if (!benefitOneTime) throw new NotFoundError('Benefit one-time moving limit not found');

    // Lấy giá trị tierBenefit của user cho 2 loại benefit trên
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

    // Trả về limit gồm số tiền và đơn vị
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

  async getMovedAmount(userId: string): Promise<number> {
    // Lấy ví payment của user
    const paymentWallet = await this._prisma.wallet.findFirst({
      where: { type: 'Payment', userId },
      select: { id: true },
    });

    if (!paymentWallet) {
      throw new NotFoundError('Payment wallet not found');
    }

    // Tính tổng amount đã chuyển từ ví payment tới partner
    const result = await this._prisma.transaction.aggregate({
      where: {
        fromWalletId: paymentWallet.id,
        partnerId: { not: null },
        type: { in: ['Expense', 'Transfer'] },
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // từ đầu ngày
          lte: new Date(new Date().setHours(23, 59, 59, 999)), // đến cuối ngày
        },
      },
      _sum: { amount: true },
    });

    return result._sum.amount?.toNumber() ?? 0;
  }

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

  async getPackageFX(data: ArgGetPackageType): Promise<number[]> {
    const { availableLimit } = data;

    // Lấy các gói FX có amount <= limit hiện tại
    const packageFXs = await this._prisma.packageFX.findMany({
      where: {
        fxAmount: { lte: availableLimit },
      },
      select: { fxAmount: true },
      orderBy: { fxAmount: 'asc' },
    });

    return packageFXs.map((pkg) => pkg.fxAmount.toNumber());
  }

  async createOTP(data: ArgCreateOTP): Promise<Otp> {
    // Kiểm tra OTP gần nhất của user
    const lastOtp = await this._prisma.otp.findFirst({
      where: {
        userId: data.userId,
        type: 'SENDING_FX',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Nếu tồn tại OTP gần nhất và chưa quá 2 phút thì không cho tạo mới
    if (lastOtp) {
      const twoMinutes = 2 * 60 * 1000; // 2 phút = 120000ms
      const expiresAt = new Date(lastOtp.createdAt.getTime() + twoMinutes);

      if (new Date() < expiresAt) {
        throw new BadRequestError('Please wait before requesting a new OTP');
      }
    }

    // Xoá OTP cũ (đã hết hạn)
    await this._prisma.otp.deleteMany({
      where: {
        userId: data.userId,
        type: 'SENDING_FX',
      },
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

  async verifyOTP(data: ArgVerifyOTP): Promise<void> {
    const { userId, otp } = data;

    // Tìm OTP gần nhất theo userId + type
    const record = await this._prisma.otp.findFirst({
      where: {
        userId,
        otp,
        type: 'SENDING_FX',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!record) {
      throw new NotFoundError('Invalid OTP'); // Không tồn tại
    }

    // Check thời gian hết hạn (duration tính bằng giây)
    const expiresAt = new Date(record.createdAt.getTime() + Number(record.duration) * 1000);

    if (new Date() > expiresAt) {
      throw new BadRequestError('OTP has expired'); // Hết hạn
    }

    // OTP chỉ dùng 1 lần → xoá sau khi verify
    await this._prisma.otp.delete({
      where: { id: record.id },
    });

    // Nếu không throw → OTP hợp lệ
  }

  async createTransactionSending(data: ArgCreateTransactionSendingType): Promise<any> {
    const { amount, recieverEmail, userId, categoryId, productIds } = data;

    const amountDecimal = new Decimal(amount);

    return this._prisma.$transaction(async (tx) => {
      let category, products;

      if (categoryId) {
        category = await tx.category.findFirst({
          where: {
            id: categoryId,
            userId,
          },
        });

        if (!category) throw new NotFoundError('Category not found');
      }

      if (productIds && productIds.length > 0) {
        products = await tx.product.findMany({
          where: {
            id: {
              in: productIds,
            },
            userId,
          },
        });

        if (!products || products?.length == 0) throw new NotFoundError('Products not found');
      }

      const sender = await tx.user.findFirst({
        where: {
          id: userId,
          isBlocked: false,
          isDeleted: false,
        },
      });

      if (!sender) {
        throw new BadRequestError('Sender no found');
      }

      // Lấy ví sender
      const senderWallet = await tx.wallet.findFirst({
        where: { userId, type: 'Payment' },
      });
      if (!senderWallet) throw new NotFoundError('Sender wallet not found');

      if (senderWallet.frBalanceActive.lt(amountDecimal)) {
        throw new BadRequestError('Insufficient balance');
      }

      // Lấy user receiver
      const receiver = await tx.user.findFirst({
        where: { email: recieverEmail, isBlocked: false, isDeleted: false },
      });
      if (!receiver) throw new NotFoundError('Receiver not found');

      // Lấy ví receiver
      const receiverWallet = await tx.wallet.findFirst({
        where: { userId: receiver.id, type: 'Payment' },
      });

      if (!receiverWallet) throw new NotFoundError('Receiver wallet not found');

      let partnerReceiver = await tx.partner.findFirst({
        where: {
          email: recieverEmail,
          userId: sender.id,
        },
      });

      if (!partnerReceiver) {
        partnerReceiver = await tx.partner.create({
          data: {
            email: receiver.email,
            name: receiver.name || receiver.email,
            logo: receiver.image,
            user: {
              connect: { id: sender.id },
            },
          },
        });
      }

      let partnerOfReceiver = await tx.partner.findFirst({
        where: {
          email: sender.email,
          userId: receiver.id,
        },
      });

      if (!partnerOfReceiver) {
        partnerOfReceiver = await tx.partner.create({
          data: {
            email: sender.email,
            name: sender.name || sender.email,
            logo: sender.image,
            user: {
              connect: { id: receiver.id },
            },
          },
        });
      }

      await tx.wallet.update({
        where: {
          id: senderWallet.id,
        },
        data: {
          frBalanceActive: {
            decrement: amountDecimal,
          },
        },
      });

      await tx.wallet.update({
        where: {
          id: receiverWallet.id,
        },
        data: {
          frBalanceActive: {
            increment: amountDecimal,
          },
        },
      });

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
        },
      });

      const createdTxIncome = await tx.transaction.create({
        data: {
          amount: amountDecimal,
          type: 'Income',
          partnerId: partnerOfReceiver.id,
          userId: receiver.id,
          toWalletId: receiverWallet.id,
          currency: Currency.FX,
          isMarked: true,
        },
      });

      return { expense: createdTxSending, income: createdTxIncome };
    });
  }

  async getCategories(userId: string) {
    // Lấy danh sách category của user (chỉ loại Expense)
    return this._prisma.category.findMany({
      where: { userId, type: 'Expense' },
      select: {
        id: true,
        icon: true,
        name: true,
      },
      orderBy: { name: 'asc' }, // sort theo tên
    });
  }

  async getProductions(userId: string): Promise<ProductType[]> {
    // Lấy danh sách product của user + kèm category
    return this._prisma.product.findMany({
      where: { userId },
      select: {
        id: true,
        icon: true,
        name: true,
        category: {
          select: {
            id: true,
            icon: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}

export const sendingWalletRepository: ISendingWalletRepository = new SendingWalletRepository();
