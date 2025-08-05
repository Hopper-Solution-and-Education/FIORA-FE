import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { TransactionType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Method is not allowed' });
      }
    },
    req,
    res,
  ),
);

const DAYS_30 = 30;
const DAYS_180 = 180;
const DAYS_365 = 365;

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { from, to } = req.body;

  // If from and to are not provided, get all transactions from current date to past
  let fromDate: Date;
  let toDate: Date;

  if (!from || !to) {
    toDate = new Date();
    // Get the earliest transaction date for this user
    const earliestTransaction = await prisma.transaction.findFirst({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        date: 'asc',
      },
    });

    fromDate = earliestTransaction ? new Date(earliestTransaction.date) : new Date();
  } else {
    fromDate = new Date(from);
    toDate = new Date(to);

    // Basic validation for valid dates
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_DATE_FORMAT));
    }

    // Ensure 'to' date is not before 'from' date
    if (toDate.getTime() < fromDate.getTime()) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.TO_DATE_BEFORE_FROM_DATE));
    }
  }

  // Calculate the difference in days
  const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Fetch transactions for the date range
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: fromDate,
        lte: toDate,
      },
      isDeleted: false,
    },
    select: {
      id: true,
      date: true,
      type: true,
      amount: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
      updatedBy: true,
      isDeleted: true,
      isMarked: true,
      deletedAt: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  let groupedTransactions: any[] = [];

  if (diffDays <= DAYS_30) {
    // Group by days
    const days = [];
    const currentDate = new Date(fromDate);
    currentDate.setHours(0, 0, 0, 0); // Set to start of day

    while (currentDate <= toDate) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        transDate.setHours(0, 0, 0, 0); // Normalize transaction date
        return transDate.getTime() === dayStart.getTime();
      });

      days.push({
        period: currentDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        startDate: dayStart,
        endDate: dayEnd,
        totalIncome: dayTransactions
          .filter((t) => t.type === TransactionType.Income)
          .reduce((sum, t) => sum + Number(t.amount), 0),
        totalExpense: dayTransactions
          .filter((t) => t.type === TransactionType.Expense)
          .reduce((sum, t) => sum + Number(t.amount), 0),
        currency: dayTransactions[0]?.currency || 'VND',
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    groupedTransactions = days;
  } else if (diffDays <= DAYS_180) {
    // Group by weeks
    const weeks = [];
    const currentDate = new Date(fromDate);

    while (currentDate <= toDate) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return transDate >= weekStart && transDate <= weekEnd;
      });

      weeks.push({
        period: `${weekStart.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - ${weekEnd.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`,
        startDate: weekStart,
        endDate: weekEnd,
        totalIncome: weekTransactions
          .filter((t) => t.type === TransactionType.Income)
          .reduce((sum, t) => sum + Number(t.amount), 0),
        totalExpense: weekTransactions
          .filter((t) => t.type === TransactionType.Expense)
          .reduce((sum, t) => sum + Number(t.amount), 0),
        currency: weekTransactions[0]?.currency || 'VND',
      });

      currentDate.setDate(currentDate.getDate() + 7);
    }
    groupedTransactions = weeks;
  } else if (diffDays <= DAYS_365) {
    // Group by months
    const months = [];
    const startMonth = fromDate.getMonth();
    const endMonth = toDate.getMonth();
    const startYear = fromDate.getFullYear();
    const endYear = toDate.getFullYear();

    for (let year = startYear; year <= endYear; year++) {
      const startM = year === startYear ? startMonth : 0;
      const endM = year === endYear ? endMonth : 11;

      for (let m = startM; m <= endM; m++) {
        const monthStart = new Date(year, m, 1);
        const monthEnd = new Date(year, m + 1, 0);

        const monthTransactions = transactions.filter((t) => {
          const transDate = new Date(t.date);
          return transDate >= monthStart && transDate <= monthEnd;
        });

        months.push({
          period: `${m + 1}/${year}`,
          startDate: monthStart,
          endDate: monthEnd,
          totalIncome: monthTransactions
            .filter((t) => t.type === TransactionType.Income)
            .reduce((sum, t) => sum + Number(t.amount), 0),
          totalExpense: monthTransactions
            .filter((t) => t.type === TransactionType.Expense)
            .reduce((sum, t) => sum + Number(t.amount), 0),
          currency: monthTransactions[0]?.currency || 'VND',
        });
      }
    }
    groupedTransactions = months;
  } else {
    // Group by years
    const years = [];
    const startYear = fromDate.getFullYear();
    const endYear = toDate.getFullYear();

    for (let year = startYear; year <= endYear; year++) {
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31);

      const yearTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return transDate >= yearStart && transDate <= yearEnd;
      });

      years.push({
        period: year.toString(),
        startDate: yearStart,
        endDate: yearEnd,
        totalIncome: yearTransactions
          .filter((t) => t.type === TransactionType.Income)
          .reduce((sum, t) => sum + Number(t.amount), 0),
        totalExpense: yearTransactions
          .filter((t) => t.type === TransactionType.Expense)
          .reduce((sum, t) => sum + Number(t.amount), 0),
        currency: yearTransactions[0]?.currency || 'VND',
      });
    }
    groupedTransactions = years;
  }

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_BUDGET_ITEM_SUCCESS, groupedTransactions));
}
