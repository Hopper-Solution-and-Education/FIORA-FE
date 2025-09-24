// --- External imports ---
import { NextApiRequest, NextApiResponse } from 'next';
import { CronJobStatus, Prisma, TransactionType, WalletType } from '@prisma/client';

// --- Config & Utils ---
import { prisma } from '@/config';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { createResponse } from '../../../shared/lib/responseUtils/createResponse';

// --- Constants ---
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';

// --- Features & Types ---
import { flexiInterestUsecases } from '@/features/setting/module/cron-job/module/flexi-interest/application/flexiInterestUsecases';
import { FlexiInterestCronjobTableData } from '@/features/setting/module/cron-job/module/flexi-interest/presentation/types/flexi-interest.type';

// --- API Handler ---
export default withAuthorization({
  GET: ['Admin'],
  PUT: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'PUT': {
      const { id: cronJobLogId } = req.query;
      return PUT(req, res, String(cronJobLogId));
    }
    case 'GET': {
      return GET(req, res);
    }
    default: {
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
    }
  }
});

// --- GET Handler ---
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, pagesize = 20, search = '', filter } = req.query;
  const filterConverted = typeof filter === 'string' ? JSON.parse(filter) : {};

  const flexiInterest = await flexiInterestUsecases.getFlexiInterestPaginated({
    page: Number(page),
    pageSize: Number(pagesize),
    filter: filterConverted,
    search: String(search),
  });

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FLEXI_INTEREST_SUCCESS, flexiInterest));
}

// --- PUT Handler ---
export async function PUT(req: NextApiRequest, res: NextApiResponse, cronJobLogId: string) {
  const { amount, reason } = req.body;

  try {
    // 1. Validate input
    if (amount == null || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'Invalid amount'));
    }

    // 2. Tìm CronJobLog
    const cronJobLog = await prisma.cronJobLog.findUnique({ where: { id: cronJobLogId } });
    if (!cronJobLog) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createResponse(RESPONSE_CODE.NOT_FOUND, 'CronJobLog not found'));
    }

    if (cronJobLog.status !== CronJobStatus.FAIL) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'Chỉ fix được log có status = FAIL'));
    }

    // 3. Lấy userId từ dynamicValue hoặc từ walletId
    let userId: string | undefined;
    try {
      const dynamic = cronJobLog.dynamicValue as any;
      if (dynamic?.userId) {
        userId = dynamic.userId;
      } else if (dynamic?.walletId) {
        // fallback: tìm userId qua walletId
        const wallet = await prisma.wallet.findUnique({
          where: { id: dynamic.walletId },
          select: { userId: true },
        });
        userId = wallet?.userId;
      }
    } catch (e) {
      console.warn('Không parse được dynamicValue:', e);
    }

    console.log('👉 userId lấy ra:', userId);
    if (!userId) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(
          createResponse(
            RESPONSE_CODE.BAD_REQUEST,
            'CronJobLog không chứa userId hợp lệ và cũng không tìm được qua walletId',
          ),
        );
    }

    // 3b. Lấy thông tin user để dùng sau này
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    // 4. Wallet
    const wallet = await prisma.wallet.findFirst({
      where: { userId, type: WalletType.Payment },
    });
    if (!wallet) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'User chưa có Payment Wallet'));
    }
    console.log('👉 wallet:', wallet);
    const membershipProgress = await prisma.membershipProgress.findFirst({
      where: { userId },
      select: { tierId: true },
      orderBy: { updatedAt: 'desc' },
    });
    console.log('👉 membershipProgress:', membershipProgress);

    // 5. Benefit Flexi Interest
    const membershipBenefit = await prisma.membershipBenefit.findFirst({
      where: { name: 'Flexi Interest' },
      select: { id: true },
    });
    if (!membershipBenefit) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(
          createResponse(
            RESPONSE_CODE.NOT_FOUND,
            'MembershipBenefit Flexi Interest chưa được seed trong DB',
          ),
        );
    }
    console.log('👉 membershipBenefit:', membershipBenefit);
    const rateBenefit = await prisma.tierBenefit.findFirst({
      where: {
        benefitId: membershipBenefit.id,
        ...(membershipProgress?.tierId && { tierId: membershipProgress.tierId }),
      },
    });
    console.log('👉 rateBenefit:', rateBenefit);

    // 6. Tính toán percentValue dựa trên tier hiện tại của user
    const rawAmount = new Prisma.Decimal(amount);
    let percentValue: Prisma.Decimal | null = null;

    const progress = await prisma.membershipProgress.findFirst({
      where: { userId },
      select: { tierId: true, tier: { select: { tierName: true } } },
    });

    if (progress?.tierId) {
      const tierBenefit = await prisma.tierBenefit.findFirst({
        where: { tierId: progress.tierId, benefitId: membershipBenefit.id },
        select: { value: true },
      });
      console.log('👉 progress:', progress);
      if (tierBenefit?.value != null) {
        percentValue = new Prisma.Decimal(tierBenefit.value);
      }
    }
    console.log('👉 percentValue:', percentValue?.toString() ?? null);
    // 7. Admin
    const adminId = (req as any).user?.id ?? undefined;
    const admin = adminId
      ? await prisma.user.findUnique({ where: { id: adminId }, select: { id: true, email: true } })
      : null;

    const account = await prisma.account.findFirst({ where: { userId } });

    // 8. Transaction trong DB
    const { createdTxn, notification } = await prisma.$transaction(async (tx) => {
      // Transaction
      const createdTxn = await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.Income,
          amount: rawAmount,
          fromAccountId: admin?.id ?? null,
          toAccountId: account?.id ?? null,
          toWalletId: wallet.id,
          remark: `Manual refund CRONJOB: ${reason ?? ''}`,
          currency: 'FX',
          membershipBenefitId: membershipBenefit.id,
          isMarked: true,
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          frBalanceActive: { increment: rawAmount },
          accumulatedEarn: { increment: rawAmount },
        },
      });

      await tx.cronJobLog.update({
        where: { id: cronJobLogId },
        data: {
          status: CronJobStatus.SUCCESSFUL,
          updatedAt: new Date(),
          updatedBy: admin?.email ?? null, // ✅ lưu email admin
          transactionId: createdTxn.id,
          dynamicValue: {
            tierName: progress?.tier?.tierName,
            tierId: progress?.tierId,
            activeBalance: wallet.frBalanceActive.toString(),
            interestAmount: rawAmount.toString(),
            email: user?.email,
            rate: rateBenefit?.value ?? null,
            reason,
            walletId: wallet.id,
            updatedBy: admin?.email ?? null, // ✅ trong dynamicValue cũng để email admin cho dễ trace
          },
        },
      });

      const notification = await tx.notification.create({
        data: {
          title: 'Hoàn tiền CRONJOB',
          message: `Bạn đã được hoàn ${rawAmount.toString()} FX${percentValue ? ` (${percentValue.toString()}%)` : ''} cho cronjob ${cronJobLogId}. Lý do: ${reason ?? ''}`,
          channel: 'BOX',
          notifyTo: 'PERSONAL',
          type: 'COMPENSATION',
          emails: user?.email ? [user.email] : undefined,
          createdBy: adminId ?? userId,
          createdAt: new Date(),
        } as any,
      });

      await tx.userNotification.create({
        data: { userId, notificationId: notification.id },
      });

      return { createdTxn, notification };
    });

    // 9. Trả về response
    const responseData: FlexiInterestCronjobTableData = {
      id: cronJobLog.id,
      email: user?.email ?? undefined,
      dateTime: cronJobLog.createdAt.toISOString(),
      membershipTier: progress?.tier?.tierName ?? undefined,
      flexiInterestRate: percentValue ? percentValue.toString() : undefined,
      activeBalance: Number(wallet.frBalanceActive),
      flexiInterestAmount: Number(rawAmount),
      status: 'SUCCESSFUL',
      updateBy: admin?.email ?? undefined,
      reason,
    };

    return res.status(RESPONSE_CODE.OK).json(
      createResponse(RESPONSE_CODE.OK, 'Refund success', {
        transaction: createdTxn,
        notificationId: notification.id,
        data: responseData,
      }),
    );
  } catch (err: any) {
    console.error('PUT CronJobLog refund error:', err);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
  }
}
