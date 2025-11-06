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
  Receiver,
} from '../../domain/types/sendingWallet.type';

/**
 * Repository layer that handles all Prisma database operations
 * for the "Sending Wallet" feature.
 *
 * Responsibilities:
 *  - Fetching user transfer limits
 *  - Calculating total transferred amount per day
 *  - Suggesting receivers (users or partners)
 *  - Creating and verifying OTPs
 *  - Executing wallet-to-wallet transfer transactions
 */
class SendingWalletRepository implements ISendingWalletRepository {
  // Slugs used to locate benefit types inside membershipBenefit table
  private _BENEFIT_DAILY_MOVING_SLUG = 'moving-daily-limit';
  private _BENEFIT_ONE_TIME_MOVING_SLUG = 'moving-1-time-limit';

  constructor(private _prisma = prisma) {}

  /**
   * Get user's sending limits (daily and one-time)
   * based on their membership tier configuration.
   */
  async getMovingLimit(userId: string): Promise<MovingLimitType> {
    // Step 1: Get user's membership progress
    const membershipProgress = await this._prisma.membershipProgress.findFirst({
      where: { userId },
    });
    if (!membershipProgress) throw new NotFoundError('Membership not found');
    if (!membershipProgress.tierId)
      throw new NotFoundError('Tier ID not found for membership progress');

    // Step 2: Retrieve the two benefit types (daily and one-time)
    const benefits = await this._prisma.membershipBenefit.findMany({
      where: {
        slug: { in: [this._BENEFIT_DAILY_MOVING_SLUG, this._BENEFIT_ONE_TIME_MOVING_SLUG] },
      },
    });

    const benefitDaily = benefits.find((b) => b.slug === this._BENEFIT_DAILY_MOVING_SLUG);
    const benefitOneTime = benefits.find((b) => b.slug === this._BENEFIT_ONE_TIME_MOVING_SLUG);
    if (!benefitDaily) throw new NotFoundError('Daily moving limit benefit not found');
    if (!benefitOneTime) throw new NotFoundError('One-time moving limit benefit not found');

    // Step 3: Get the benefit values for the user's current tier
    const tierBenefits = await this._prisma.tierBenefit.findMany({
      where: {
        tierId: membershipProgress.tierId,
        benefitId: { in: [benefitDaily.id, benefitOneTime.id] },
      },
    });

    const tierDaily = tierBenefits.find((tb) => tb.benefitId === benefitDaily.id);
    const tierOneTime = tierBenefits.find((tb) => tb.benefitId === benefitOneTime.id);
    if (!tierDaily) throw new NotFoundError('Daily moving limit value not found');
    if (!tierOneTime) throw new NotFoundError('One-time moving limit value not found');

    // Step 4: Return limit values and currency type
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
   * Calculate the total amount sent today from the user’s Payment wallet.
   */
  async getMovedAmount(userId: string): Promise<number> {
    const paymentWallet = await this._prisma.wallet.findFirst({
      where: { type: 'Payment', userId },
      select: { id: true },
    });
    if (!paymentWallet) throw new NotFoundError('Payment wallet not found');

    // Sum all outgoing Expense/Transfer transactions within the current day
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
   * Suggest receivers based on email query.
   * Combines both Partner and User tables.
   * - Prioritizes partners when email duplicates occur.
   * - Limits result to 10 records.
   */
  async getRecommendReceiver(query: string, userId: string): Promise<Receiver[]> {
    const receivers = await this._prisma.$queryRaw<Receiver[]>`
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
   * Fetch available FX package amounts
   * that are below or equal to the user’s current available limit.
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
   * Create a new OTP for FX sending.
   * Enforces a 2-minute cooldown before allowing a new OTP request.
   */
  async createOTP(data: ArgCreateOTP): Promise<Otp> {
    const lastOtp = await this._prisma.otp.findFirst({
      where: { userId: data.userId, type: 'SENDING_FX' },
      orderBy: { createdAt: 'desc' },
    });

    // Enforce cooldown (2 minutes)
    if (lastOtp) {
      const twoMinutes = 2 * 60 * 1000;
      const expiresAt = new Date(lastOtp.createdAt.getTime() + twoMinutes);
      if (new Date() < expiresAt) {
        throw new BadRequestError('Please wait before requesting a new OTP');
      }
    }

    // Remove old OTPs
    await this._prisma.otp.deleteMany({
      where: { userId: data.userId, type: 'SENDING_FX' },
    });

    // Create a new OTP record
    return this._prisma.otp.create({
      data: {
        ...data,
        id: crypto.randomUUID(),
        type: 'SENDING_FX',
      },
    });
  }

  /**
   * Verify OTP validity.
   * - Ensures OTP exists, has not expired, and deletes it after successful validation.
   */
  async verifyOTP(data: ArgVerifyOTP): Promise<void> {
    const { userId, otp } = data;

    const record = await this._prisma.otp.findFirst({
      where: { userId, otp, type: 'SENDING_FX' },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw new NotFoundError('Invalid OTP');

    const expiresAt = new Date(record.createdAt.getTime() + Number(record.duration) * 1000);
    if (new Date() > expiresAt) throw new BadRequestError('OTP has expired');

    // Delete OTP after successful verification (one-time use)
    await this._prisma.otp.delete({ where: { id: record.id } });
  }

  /**
   * Create a two-sided transaction for sending FX:
   * - Expense record for sender
   * - Income record for receiver
   * Ensures atomicity using Prisma transaction.
   */
  async createTransactionSending(data: ArgCreateTransactionSendingType): Promise<any> {
    const { amount, receiverEmail, userId, categoryId, productIds, description } = data;
    const amountDecimal = new Decimal(amount);

    return this._prisma.$transaction(async (tx) => {
      // Validate category (if provided)
      let category, products;
      if (categoryId) {
        category = await tx.category.findFirst({ where: { id: categoryId, userId } });
        if (!category) throw new NotFoundError('Category not found');
      }

      // Validate product list (if provided)
      if (productIds && productIds.length > 0) {
        products = await tx.product.findMany({
          where: { id: { in: productIds }, userId },
        });
        if (!products?.length) throw new NotFoundError('Products not found');
      }

      // Validate sender and sender wallet
      const sender = await tx.user.findFirst({
        where: { id: userId, isBlocked: false, isDeleted: false },
      });
      if (!sender) throw new BadRequestError('Sender not found');

      const senderWallet = await tx.wallet.findFirst({
        where: { userId, type: 'Payment' },
      });
      if (!senderWallet) throw new NotFoundError('Sender wallet not found');

      if (senderWallet.frBalanceActive.lt(amountDecimal))
        throw new BadRequestError('Insufficient balance');

      // Validate receiver and receiver wallet
      const receiver = await tx.user.findFirst({
        where: { email: receiverEmail, isBlocked: false, isDeleted: false },
      });
      if (!receiver) throw new NotFoundError('Receiver not found');

      const receiverWallet = await tx.wallet.findFirst({
        where: { userId: receiver.id, type: 'Payment' },
      });
      if (!receiverWallet) throw new NotFoundError('Receiver wallet not found');

      // Ensure mutual partner records exist between sender and receiver
      let partnerReceiver = await tx.partner.findFirst({
        where: { email: receiverEmail, userId: sender.id },
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

      // Update wallet balances for both parties
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { frBalanceActive: { decrement: amountDecimal } },
      });
      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { frBalanceActive: { increment: amountDecimal } },
      });

      // Create Expense transaction for sender
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
          remark: description?.trim(),
        },
      });

      // Create Income transaction for receiver
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
          remark: description?.trim(),
        },
      });

      // Return both transaction records
      return { expense: createdTxSending, income: createdTxIncome };
    });
  }

  /**
   * Fetch all categories of type "Expense".
   */
  async getCategories(userId: string) {
    return this._prisma.category.findMany({
      where: { userId, type: 'Expense' },
      select: { id: true, icon: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Fetch all products belonging to a user, including their category info.
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
