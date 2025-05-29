import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { TransactionType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
      case 'POST':
        return POST(req, res, userId);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Method is not allowed' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

const MONTH = 30;
const TWO_YEARS = 730; // 2 years in days

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
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

    if (diffDays <= MONTH) {
      // Nhóm dữ liệu theo tuần (mỗi tháng có đúng 4 tuần)
      const weeks = [];
      let currentDate = new Date(fromDate);

      /**
       * Tính số tuần trong tháng (1-4)
       * - Tuần 1: Ngày 1-7
       * - Tuần 2: Ngày 8-14
       * - Tuần 3: Ngày 15-21 (hiển thị tháng hiện tại/tháng tiếp theo)
       * - Tuần 4: Ngày 22-cuối tháng (hiển thị tháng hiện tại/tháng tiếp theo)
       */
      const getWeekNumberInMonth = (date: Date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const diff = date.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfMonth = Math.floor(diff / oneDay);
        return Math.floor(dayOfMonth / 7) + 1;
      };

      // Lấy tên tháng để hiển thị (vd: March, April,...)
      const getMonthName = (date: Date) => {
        return date.toLocaleString('default', { month: 'long' });
      };

      while (currentDate <= toDate) {
        // Tính ngày bắt đầu và kết thúc của tuần hiện tại
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekNumber = getWeekNumberInMonth(currentDate);
        let periodLabel;

        // Đối với tuần 3 và 4, hiển thị cả tháng hiện tại và tháng tiếp theo
        // Ví dụ: "Week 3 (March/April)" hoặc "Week 4 (March/April)"
        if (weekNumber >= 3) {
          const nextMonth = new Date(currentDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          periodLabel = `Week ${weekNumber} (${getMonthName(currentDate)}/${getMonthName(nextMonth)})`;
        } else {
          // Tuần 1 và 2 chỉ hiển thị tháng hiện tại
          // Ví dụ: "Week 1 (March)" hoặc "Week 2 (March)"
          periodLabel = `Week ${weekNumber} (${getMonthName(currentDate)})`;
        }

        // Lọc các giao dịch trong khoảng thời gian của tuần hiện tại
        const weekTransactions = transactions.filter((t) => {
          const transDate = new Date(t.date);
          return transDate >= weekStart && transDate <= weekEnd;
        });

        // Thêm dữ liệu tuần vào mảng kết quả
        weeks.push({
          period: periodLabel,
          startDate: weekStart,
          endDate: weekEnd,
          // Tính tổng thu nhập trong tuần
          totalIncome: weekTransactions
            .filter((t) => t.type === TransactionType.Income)
            .reduce((sum, t) => sum + Number(t.amount), 0),
          // Tính tổng chi tiêu trong tuần
          totalExpense: weekTransactions
            .filter((t) => t.type === TransactionType.Expense)
            .reduce((sum, t) => sum + Number(t.amount), 0),
        });

        // Di chuyển đến tuần tiếp theo
        currentDate.setDate(currentDate.getDate() + 7);

        // Sau khi xử lý đủ 4 tuần, chuyển sang tháng tiếp theo
        // Đảm bảo mỗi tháng luôn có đúng 4 tuần
        if (weeks.length % 4 === 0) {
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }
      }
      groupedTransactions = weeks;
    } else if (diffDays <= TWO_YEARS) {
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
        });
      }
      groupedTransactions = years;
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(RESPONSE_CODE.OK, Messages.GET_BUDGET_ITEM_SUCCESS, groupedTransactions),
      );
  } catch (error: any) {
    console.error('Error in POST:', error);
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(error.status, error.message, error));
  }
}
