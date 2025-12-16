import { prisma } from '@/config';
import { sendBulkEmailUtility } from '@/config/send-grid/sendGrid';
import { Messages } from '@/shared/constants/message';
import { BadRequestError } from '@/shared/lib';
import { buildReferralCodeCandidate, REFERRAL_CODE_MAX_ATTEMPTS } from '@/shared/utils/common';
import { Prisma, Referral, Transaction, TransactionType, Wallet, WalletType } from '@prisma/client';
import { readFileSync } from 'fs';
import { randomUUID } from 'node:crypto';
import { join } from 'path';
import {
  IReferralRepository,
  ListInvitesParams,
  ListInvitesResult,
} from '../../domain/repositories/referralRepository.interface';
import type {
  PaginatedTransactionResponse,
  ReferralDashboardSummary,
  TransactionFilters,
} from '../../types';

class ReferralRepository implements IReferralRepository {
  constructor(private _prisma = prisma) {}

  async getDashboardSummary(userId: string): Promise<ReferralDashboardSummary> {
    const [wallet, user, txIn, txOut] = await Promise.all([
      this._prisma.wallet.findFirst({
        where: { userId, type: WalletType.Referral },
      }),
      this._prisma.user.findUnique({ where: { id: userId }, select: { referral_code: true } }),
      this._prisma.transaction.aggregate({
        where: { userId, toWallet: { type: WalletType.Referral } },
        _sum: { amount: true },
      }),
      this._prisma.transaction.aggregate({
        where: { userId, fromWallet: { type: WalletType.Referral } },
        _sum: { amount: true },
      }),
    ]);

    if (!wallet) throw new Error('Referral wallet not found');

    // Ensure user has a referral code, create one if missing
    let referralCode = user?.referral_code;
    if (!referralCode) {
      referralCode = await this.ensureUserHasReferralCode(userId);
    }

    const totalEarned = Number(txIn._sum.amount || 0);
    const totalWithdrawn = Number(txOut._sum.amount || 0);
    const availableBalance = Number(wallet.frBalanceActive || 0);

    return {
      totalEarned,
      totalWithdrawn,
      availableBalance,
      referralCode,
    };
  }

  async listInvites(params: ListInvitesParams): Promise<ListInvitesResult> {
    const { userId, status, emailSearch, page = 1, pageSize = 10 } = params;
    const where: Prisma.ReferralWhereInput = { userId };
    if (status) where.status = status as any;
    if (emailSearch) where.refereeEmail = { contains: emailSearch, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this._prisma.referral.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this._prisma.referral.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async inviteByEmails(
    userId: string,
    emails: string[],
    createdBy?: string | null,
  ): Promise<{ created: Referral[]; duplicates: string[] }> {
    const uniqueEmails = Array.from(new Set(emails.map((e) => e.trim().toLowerCase())));

    // Get user's referral code
    const user = await this._prisma.user.findUnique({
      where: { id: userId },
      select: { referral_code: true },
    });

    if (!user?.referral_code) {
      throw new Error('User does not have a referral code');
    }

    // Check for existing referrals
    const existing = await this._prisma.referral.findMany({
      where: { userId, refereeEmail: { in: uniqueEmails } },
      select: { refereeEmail: true },
    });
    const existingSet = new Set(existing.map((r) => r.refereeEmail.toLowerCase()));
    const toCreate = uniqueEmails.filter((e) => !existingSet.has(e));
    const duplicates = uniqueEmails.filter((e) => existingSet.has(e));

    // Send emails to all valid emails (both new and existing)
    if (uniqueEmails.length > 0) {
      await this.sendReferralInvitations(uniqueEmails, user.referral_code);
    }

    // Only create referrals for emails that don't already exist
    if (!toCreate.length) {
      return { created: [], duplicates };
    }

    const created: Referral[] = await this._prisma.$transaction(
      toCreate.map((email) =>
        this._prisma.referral.create({
          data: {
            id: randomUUID(),
            userId,
            refereeEmail: email,
            status: 'INVITED' as any,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: createdBy || null,
          },
        }),
      ),
    );

    return { created, duplicates };
  }

  private async sendReferralInvitations(emails: string[], referralCode: string): Promise<void> {
    try {
      const subject = "You've been invited to join FIORA!";
      const htmlContent = this.createReferralEmailTemplate(referralCode);

      await sendBulkEmailUtility(emails, subject, htmlContent, {
        from: process.env.SENDER_EMAIL || 'noreply@fiora.com',
        batchSize: 100,
        delayBetweenBatches: 1000,
      });

      console.log(
        `Sent referral invitations to ${emails.length} emails with code: ${referralCode}`,
      );
    } catch (error) {
      console.error('Failed to send referral invitations:', error);
      // Don't throw error to avoid breaking the referral creation process
      // Just log the error and continue
    }
  }

  private createReferralEmailTemplate(referralCode: string): string {
    try {
      // Get NEXTAUTH_URL for environment awareness
      const nextAuthUrl = process.env.NEXTAUTH_URL;

      // Determine the correct project root based on environment
      let projectRoot: string;
      if (nextAuthUrl) {
        const isDistBuild = process.cwd().includes('dist') || process.cwd().includes('build');
        projectRoot = isDistBuild ? join(process.cwd(), '..', '..', '..') : process.cwd();
      } else {
        projectRoot = process.cwd();
      }

      // Construct file path using environment-aware project root
      const templatePath = join(
        projectRoot,
        'src',
        'features',
        'referral',
        'infrastructure',
        'emailTemplates',
        'referralInvitation.html',
      );

      let templateContent = readFileSync(templatePath, 'utf8');

      const baseUrl = process.env.NEXTAUTH_URL
        ? process.env.NEXTAUTH_URL.replace(/\/$/, '')
        : 'http://localhost:3000';

      templateContent = templateContent.replace(/\[BASE_URL\]/g, baseUrl);
      templateContent = templateContent.replace(/\[REFERRAL_CODE\]/g, referralCode);

      return templateContent;
    } catch (error) {
      console.error('Error reading referral email template:', error);

      const fallbackBaseUrl = process.env.NEXTAUTH_URL
        ? process.env.NEXTAUTH_URL.replace(/\/$/, '') // Remove trailing slash if present
        : 'http://localhost:3000';

      // Fallback to a simple template if file reading fails
      return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You've been invited to join FIORA!</title>
  </head>
  <body>
    <h1>You've been invited to join FIORA!</h1>
    <p>Hello,</p>
    <p>Great news! You've been invited to join FIORA platform.</p>
    <p>Your referral code: ${referralCode}</p>
    <p>Join now: ${fallbackBaseUrl}</p>
    <p>Sincerely, FIORA Team</p>
  </body>
</html>`;
    }
  }

  async getWalletTransactions(
    userId: string,
    limit = 50,
    filters?: TransactionFilters,
  ): Promise<Transaction[]> {
    const refWallet = await this._prisma.wallet.findFirst({
      where: { userId, type: WalletType.Referral },
    });
    if (!refWallet) throw new Error('Referral wallet not found');

    // Build where clause with filters
    const where: Prisma.TransactionWhereInput = {
      userId,
      OR: [{ fromWalletId: refWallet.id }, { toWalletId: refWallet.id }],
    };

    // Apply type filter
    if (filters?.type && filters.type.length > 0) {
      where.type = { in: filters.type as TransactionType[] };
    }

    // Apply date range filter
    if (filters?.fromDate || filters?.toDate) {
      where.date = {};
      if (filters.fromDate) {
        where.date.gte = filters.fromDate;
      }
      if (filters.toDate) {
        // Set to end of day for toDate
        const endOfDay = new Date(filters.toDate);
        endOfDay.setHours(23, 59, 59, 999);
        where.date.lte = endOfDay;
      }
    }

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      where.AND = [
        {
          OR: [
            { remark: { contains: searchTerm, mode: 'insensitive' } },
            { fromWallet: { name: { contains: searchTerm, mode: 'insensitive' } } },
            { toWallet: { name: { contains: searchTerm, mode: 'insensitive' } } },
          ],
        },
      ];
    }

    return this._prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        fromWallet: { select: { id: true, name: true, type: true } },
        toWallet: { select: { id: true, name: true, type: true } },
        fromCategory: true,
        membershipBenefit: true,
      },
    });
  }

  async getWalletTransactionsPaginated(
    userId: string,
    page: number,
    pageSize: number,
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactionResponse> {
    const refWallet = await this._prisma.wallet.findFirst({
      where: { userId, type: WalletType.Referral },
    });
    if (!refWallet) throw new Error('Referral wallet not found');

    // Build where clause with filters (same logic as non-paginated version)
    const where: Prisma.TransactionWhereInput = {
      userId,
      OR: [{ fromWalletId: refWallet.id }, { toWalletId: refWallet.id }],
    };

    // Apply type filter
    if (filters?.type && filters.type.length > 0) {
      where.type = { in: filters.type as TransactionType[] };
    }

    // Apply date range filter
    if (filters?.fromDate || filters?.toDate) {
      where.date = {};
      if (filters.fromDate) {
        where.date.gte = filters.fromDate;
      }
      if (filters.toDate) {
        const endOfDay = new Date(filters.toDate);
        endOfDay.setHours(23, 59, 59, 999);
        where.date.lte = endOfDay;
      }
    }

    // Apply search filter
    const term = filters?.search?.trim();
    if (term) {
      where.AND = [
        {
          OR: [
            { remark: { contains: term, mode: 'insensitive' } },
            { fromWallet: { is: { name: { contains: term, mode: 'insensitive' } } } },
            { toWallet: { is: { name: { contains: term, mode: 'insensitive' } } } },
          ],
        },
      ];
    }

    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this._prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: pageSize,
        include: {
          fromWallet: { select: { id: true, name: true, type: true } },
          toWallet: { select: { id: true, name: true, type: true } },
          fromCategory: true,
          membershipBenefit: true,
        },
      }),
      this._prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const hasMore = page < totalPages;

    return {
      items,
      total,
      page,
      pageSize,
      hasMore,
    };
  }

  async withdraw(
    userId: string,
    amount: number,
    options?: { minThreshold?: number },
  ): Promise<{ fromWallet: Wallet; toWallet: Wallet }> {
    if (amount <= 0) throw new Error('Amount must be greater than 0');

    const [refWallet, payWallet] = await Promise.all([
      this._prisma.wallet.findFirst({ where: { userId, type: WalletType.Referral } }),
      this._prisma.wallet.findFirst({ where: { userId, type: WalletType.Payment } }),
    ]);

    if (!refWallet) throw new Error('Referral wallet not found');

    if (!payWallet) throw new Error('Payment wallet not found');

    const setting = (await this._prisma.referralSetting.findFirst().catch(() => null)) as any;
    const cfgMin = setting?.minimumWithdrawal ? Number(setting.minimumWithdrawal) : undefined;
    const minThreshold = options?.minThreshold ?? cfgMin ?? 100;
    const currentBalance = Number(refWallet.frBalanceActive);
    if (currentBalance < minThreshold) throw new Error('Minimum withdrawal threshold not met');
    if (currentBalance < amount) throw new Error('Insufficient referral wallet balance');

    // Transfer via transaction record and adjust balances
    await this._prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.Transfer,
          amount,
          fromWalletId: refWallet.id,
          toWalletId: payWallet.id,
          remark: 'Referral withdrawal',
        },
      });

      await tx.wallet.update({
        where: { id: refWallet.id },
        data: { frBalanceActive: new Prisma.Decimal(currentBalance - amount) },
      });
      const payBal = Number(payWallet.frBalanceActive || 0);
      await tx.wallet.update({
        where: { id: payWallet.id },
        data: { frBalanceActive: new Prisma.Decimal(payBal + amount) },
      });
    });

    const [fromWallet, toWallet] = await Promise.all([
      this._prisma.wallet.findUnique({ where: { id: refWallet.id } }),
      this._prisma.wallet.findUnique({ where: { id: payWallet.id } }),
    ]);

    // Non-null assertion safe due to prior operations
    return { fromWallet: fromWallet!, toWallet: toWallet! };
  }

  /**
   * Ensures a user has a referral code, creating one if it doesn't exist
   */
  private async ensureUserHasReferralCode(userId: string): Promise<string> {
    for (let attempt = 0; attempt < REFERRAL_CODE_MAX_ATTEMPTS; attempt += 1) {
      const referralCode = await this.generateUniqueReferralCode();

      try {
        const updatedUser = await this._prisma.user.update({
          where: { id: userId },
          data: { referral_code: referralCode },
          select: { referral_code: true },
        });

        return updatedUser.referral_code!;
      } catch (error) {
        if (this.isReferralCodeUniqueConstraintError(error)) {
          continue;
        }
        throw error;
      }
    }

    throw new BadRequestError(Messages.FAILED_TO_GENERATE_UNIQUE_REFERRAL_CODE_FOR_USER);
  }

  /**
   * Generates a unique referral code by checking for existing codes
   */
  private async generateUniqueReferralCode(): Promise<string> {
    for (let attempt = 0; attempt < REFERRAL_CODE_MAX_ATTEMPTS; attempt += 1) {
      const code = buildReferralCodeCandidate();
      const existing = await this._prisma.user.findUnique({ where: { referral_code: code } });
      if (!existing) {
        return code;
      }
    }

    throw new BadRequestError(Messages.FAILED_TO_GENERATE_UNIQUE_REFERRAL_CODE_FOR_USER);
  }

  /**
   * Checks if an error is a Prisma unique constraint error for referral_code
   */
  private isReferralCodeUniqueConstraintError(error: unknown): boolean {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return false;
    }

    if (error.code !== 'P2002') {
      return false;
    }

    const target = error.meta?.target;
    if (Array.isArray(target)) {
      return target.includes('referral_code');
    }

    return typeof target === 'string' && target.includes('referral_code');
  }
}

export const referralRepository: IReferralRepository = new ReferralRepository();
