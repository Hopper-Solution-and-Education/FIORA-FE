import { prisma } from '@/config';
import { flexiInterestUsecases } from '@/features/setting/module/cron-job/module/flexi-interest/application/flexiInterestUsecases';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { CronJobStatus, Prisma, TransactionType, WalletType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { createResponse } from '../../../shared/lib/responseUtils/createResponse';

export default withAuthorization({
  GET: ['Admin'],
  PUT: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'PUT': {
      const { id: cronJobLogId } = req.query; // <- bọc trong block {}
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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, pagesize = 20, search = '', filter } = req.query;
  const filterConverted = typeof filter === 'string' ? JSON.parse(filter) : {};
  console.log('🚀 ~ GET ~ filterConverted:', filterConverted);

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

export async function PUT(req: NextApiRequest, res: NextApiResponse, cronJobLogId: string) {
  const { amount, reason } = req.body;

  try {
    if (amount == null || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'Invalid amount'));
    }

    const cronJobLog = await prisma.cronJobLog.findUnique({
      where: { id: cronJobLogId },
    });

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

    const userId = cronJobLog.createdBy;
    if (!userId) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(
          createResponse(
            RESPONSE_CODE.BAD_REQUEST,
            'CronJobLog does not have a valid createdBy userId',
          ),
        );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createResponse(RESPONSE_CODE.NOT_FOUND, 'User not found'));
    }

    const wallet = await prisma.wallet.findFirst({
      where: { userId, type: WalletType.Payment },
    });

    if (!wallet) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'User chưa có Payment Wallet'));
    }

    // Tìm MembershipBenefit Flexi Interest
    const flexiBenefit = await prisma.membershipBenefit.findFirst({
      where: { name: 'Flexi Interest' },
      select: { id: true },
    });

    if (!flexiBenefit) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(
          createResponse(
            RESPONSE_CODE.NOT_FOUND,
            'MembershipBenefit Flexi Interest chưa được seed trong DB',
          ),
        );
    }

    const interestAmountBefore = wallet.frBalanceActive;
    const rawAmount = new Prisma.Decimal(amount);
    let finalAmount = rawAmount;
    let percentValue: Prisma.Decimal | null = null;

    const progress = await prisma.membershipProgress.findFirst({
      where: { userId },
      select: { tierId: true, tier: { select: { tierName: true } } },
    });

    if (progress?.tierId) {
      const tierBenefit = await prisma.tierBenefit.findFirst({
        where: { tierId: progress.tierId, benefitId: flexiBenefit.id },
        select: { value: true },
      });

      if (tierBenefit?.value != null) {
        percentValue = new Prisma.Decimal(tierBenefit.value);
        // 👉 nhân hệ số lãi suất vào
        finalAmount = rawAmount.mul(percentValue).div(100);
      }
    }

    const adminId = (req as any).user?.id ?? undefined;
    const admin = adminId
      ? await prisma.user.findUnique({
          where: { id: adminId },
          select: { id: true },
        })
      : null;

    const account = await prisma.account.findFirst({
      where: { userId }, // tìm account theo user
    });

    const { createdTxn, notification } = await prisma.$transaction(async (tx) => {
      // 1. Transaction
      const createdTxn = await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.Income,
          amount: finalAmount,
          fromAccountId: admin?.id ?? null, // account Admin
          toAccountId: account?.id ?? null, // account User
          toWalletId: wallet.id,
          remark: `Manual refund CRONJOB: ${reason ?? ''}`,
          currency: 'FX',
          membershipBenefitId: flexiBenefit.id,
          isMarked: true,
          createdBy: adminId ?? undefined,
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          frBalanceActive: { increment: finalAmount },
          accumulatedEarn: { increment: finalAmount },
        },
      });

      // 2. Update CronJobLog
      await tx.cronJobLog.update({
        where: { id: cronJobLogId },
        data: {
          status: CronJobStatus.SUCCESSFUL,
          updatedAt: new Date(),
          updatedBy: adminId ?? userId,
          transactionId: createdTxn.id,
          dynamicValue: {
            tierName: progress?.tier?.tierName,
            tierId: progress?.tierId,
            activeBalance: wallet.frBalanceActive.toString(),
            interestAmount: interestAmountBefore.toString(), //Lấy ví ngay lúc log
            email: user?.email,
            rate: percentValue ? percentValue.toString() : null,
            reason: reason,
            walletId: wallet.id,
            updatedBy: adminId ?? null,
          },
        },
      });

      // 3. Notification
      const notification = await tx.notification.create({
        data: {
          title: 'Hoàn tiền CRONJOB',
          message: `Bạn đã được hoàn ${finalAmount.toString()} FX${percentValue ? ` (${percentValue.toString()}%)` : ''} cho cronjob ${cronJobLogId}. Lý do: ${reason ?? ''}`,
          channel: 'BOX',
          notifyTo: 'PERSONAL',
          type: 'COMPENSATION',
          emails: user?.email ? [user.email] : undefined,
          createdBy: adminId ?? undefined,
        } as any,
      });

      await tx.userNotification.create({
        data: {
          userId,
          notificationId: notification.id,
        },
      });

      return { createdTxn, notification };
    });

    return res.status(RESPONSE_CODE.OK).json(
      createResponse(RESPONSE_CODE.OK, 'Refund success', {
        transaction: createdTxn,
        notificationId: notification.id,
      }),
    );
  } catch (err: any) {
    console.error('PUT CronJobLog refund error:', err);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
  }
}
