import { prisma } from '@/config';
import { sendBulkEmailUtility } from '@/config/send-grid/sendGrid';
import { Prisma, Referral, Transaction, TransactionType, Wallet, WalletType } from '@prisma/client';
import { randomUUID } from 'node:crypto';
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

    const totalEarned = Number(txIn._sum.amount || 0);
    const totalWithdrawn = Number(txOut._sum.amount || 0);
    const availableBalance = Number(wallet.frBalanceActive || 0);

    return {
      totalEarned,
      totalWithdrawn,
      availableBalance,
      referralCode: user?.referral_code ?? null,
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
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've been invited to join FIORA!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f0f4f8; color: #2d3748;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #e6eef5 0%, #f0f4f8 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 50, 100, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(90deg, #007bff, #00c4ff); padding: 30px; text-align: center; position: relative; overflow: hidden;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">FIORA</h1>
              <p style="color: #e6f0ff; margin: 8px 0 0; font-size: 14px; font-style: italic;">Join the Community</p>
              <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 25px; color: #1a202c;">You're Invited to Join FIORA!</h2>
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 25px; color: #4a5568;">
                Great news! You've been invited to join FIORA, an exciting platform where you can earn rewards through our referral program.
              </p>
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 25px; color: #4a5568;">
                Your friend has shared their referral code with you. Use this code when you sign up to get started:
              </p>
              <div style="background: linear-gradient(45deg, #e9f1ff, #f8fafc); padding: 20px; border-radius: 8px; display: inline-block; margin: 25px 0; box-shadow: 0 2px 10px rgba(0, 123, 255, 0.1);">
                <span style="font-size: 28px; font-weight: 700; letter-spacing: 3px; color: #007bff; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);">${referralCode}</span>
              </div>
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 25px; color: #4a5568;">
                Join thousands of users who are already earning rewards through our platform. It's free to sign up and easy to get started!
              </p>
              <a href="https://fiora.com/signup?ref=${referralCode}" style="display: inline-block; padding: 14px 30px; background: linear-gradient(90deg, #007bff, #00c4ff); color: #ffffff; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);">
                Join FIORA Now
              </a>
              <p style="font-size: 12px; color: #a0aec0; margin: 25px 0 0; font-style: italic;">
                Questions? Visit our help center or contact our support team.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #f7fafc; padding: 25px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0;">© 2025 FIORA. All rights reserved.</p>
              <p style="margin: 8px 0 0;">
                Need help? Reach us at <a href="mailto:support@fiora.com" style="color: #007bff; text-decoration: none; font-weight: 500;">support@fiora.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
}

export const referralRepository: IReferralRepository = new ReferralRepository();
