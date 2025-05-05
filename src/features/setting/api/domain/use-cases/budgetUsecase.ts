import { prisma } from '@/config';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import { buildWhereClause } from '@/shared/utils';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import {
  BudgetDetailType,
  BudgetsTable,
  BudgetType,
  Currency,
  Prisma,
  TransactionType,
} from '@prisma/client';
import _ from 'lodash';
import { budgetDetailRepository } from '../../infrastructure/repositories/budgetDetailRepository';
import { budgetRepository } from '../../infrastructure/repositories/budgetProductRepository';
import { IBudgetDetailRepository } from '../../repositories/budgetDetailRepository';
import {
  BudgetCreation,
  BudgetGetAnnualYearParams,
  IBudgetRepository,
} from '../../repositories/budgetRepository';

class BudgetUseCase {
  private budgetRepository: IBudgetRepository;
  private budgetDetailRepository: IBudgetDetailRepository;
  private transactionRepository: ITransactionRepository;

  constructor(
    budgetRepository: IBudgetRepository,
    budgetDetailRepository: IBudgetDetailRepository,
    transactionRepository: ITransactionRepository,
  ) {
    this.budgetRepository = budgetRepository;
    this.budgetDetailRepository = budgetDetailRepository;
    this.transactionRepository = transactionRepository;
  }

  async createBudget(params: BudgetCreation) {
    const {
      userId,
      fiscalYear,
      description,
      estimatedTotalExpense,
      estimatedTotalIncome,
      icon,
      currency,
      isSystemGenerated = false,
    } = params;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Cách hiện tại 30 ngày

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    let targetMonthEnd: Date;

    const yearStart = new Date(`${fiscalYear}-01-01`);

    if (fiscalYear === currentYear) {
      const targetMonth = currentMonth - 2; // Đồng bộ với updateActBudget: lấy đến tháng cách đó 2 tháng
      if (targetMonth < 1) {
        // Nếu targetMonth < 1 (tháng 1, 2), không tính giao dịch
        targetMonthEnd = yearStart;
      } else {
        targetMonthEnd = new Date(fiscalYear, targetMonth, 0); // Ngày cuối của tháng target
      }
    } else {
      // Năm quá khứ: Lấy toàn bộ năm
      targetMonthEnd = new Date(`${fiscalYear}-12-31`);
    }

    // Áp dụng điều kiện "locked"
    const effectiveEndDate = targetMonthEnd < thirtyDaysAgo ? targetMonthEnd : thirtyDaysAgo;

    const transactions = await this.transactionRepository.findManyTransactions(
      {
        userId,
        date: {
          gte: yearStart,
          lte: effectiveEndDate, // Giới hạn bởi targetMonthEnd và thirtyDaysAgo
        },
        isDeleted: false,
        type: {
          in: [TransactionType.Expense, TransactionType.Income],
        },
      },
      {
        select: {
          type: true,
          amount: true,
          currency: true,
        },
      },
    );

    // Calculate total income and expense for 'Act' budget with currency conversion
    const totalExpenseAct = transactions
      .filter((t) => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);

    const totalIncomeAct = transactions
      .filter((t) => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);

    // Step 2: Define budget data for all three types
    const budgetTypesData: {
      type: BudgetsTable['type'];
      totalExpense: number;
      totalIncome: number;
    }[] = [
      { type: 'Top', totalExpense: estimatedTotalExpense, totalIncome: estimatedTotalIncome },
      { type: 'Bot', totalExpense: estimatedTotalExpense, totalIncome: estimatedTotalIncome },
      { type: 'Act', totalExpense: totalExpenseAct, totalIncome: totalIncomeAct },
    ];

    // Create budget details for each month
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Quarterly fields
    const quarters = {
      q1: [1, 2, 3],
      q2: [4, 5, 6],
      q3: [7, 8, 9],
      q4: [10, 11, 12],
    };

    const createdBudgets: BudgetsTable[] = [];

    // Step 3: Create budgets for each type
    for (const { type, totalExpense, totalIncome } of budgetTypesData) {
      const monthlyExpense = _.round(totalExpense / 12, 2); // calculate with 2 decimal places
      const monthlyIncome = _.round(totalIncome / 12, 2); // calculate with 2 decimal places

      // Monthly fields split into 12 months
      const monthFields = months.reduce<Record<string, number>>((acc, m) => {
        acc[`m${m}_exp`] = monthlyExpense;
        acc[`m${m}_inc`] = monthlyIncome;
        return acc;
      }, {});

      // Quarterly fields
      const quarterFields = Object.entries(quarters).reduce<Record<string, number>>(
        (acc, [q, ms]) => {
          acc[`${q}_exp`] = _.round(ms.length * monthlyExpense, 2); // by multiplying by 3 months with monthlyExpense
          acc[`${q}_inc`] = _.round(ms.length * monthlyIncome, 2); // by multiplying by 3 months with monthlyIncome
          return acc;
        },
        {},
      );

      // Half-year totals
      const h1_exp = _.round(monthlyExpense * 6, 2); // 6 months in half-year
      const h2_exp = _.round(monthlyExpense * 6, 2); // 6 months in half-year
      const h1_inc = _.round(monthlyIncome * 6, 2); // 6 months in half-year
      const h2_inc = _.round(monthlyIncome * 6, 2); // 6 months in half-year

      // Create Budget
      const newBudget = await this.budgetRepository.createBudget({
        userId,
        icon,
        fiscalYear,
        type,
        total_exp: totalExpense,
        total_inc: totalIncome,
        h1_exp,
        h2_exp,
        h1_inc,
        h2_inc,
        ...quarterFields,
        ...monthFields,
        createdBy: !isSystemGenerated ? userId : undefined,
        description,
        currency,
      });

      if (!newBudget) {
        throw new Error(Messages.BUDGET_CREATE_FAILED);
      }

      // Create BudgetDetails (24 rows)
      const detailData = months.flatMap((month) => [
        {
          userId,
          budgetId: newBudget.id,
          type: BudgetDetailType.Expense,
          amount: monthlyExpense,
          month,
          createdBy: userId,
        },
        {
          userId,
          budgetId: newBudget.id,
          type: BudgetDetailType.Income,
          amount: monthlyIncome,
          month,
          createdBy: userId,
        },
      ]) as Prisma.BudgetDetailsCreateManyInput[];

      const createdBudgetDetailRes =
        await this.budgetDetailRepository.createManyBudgetDetails(detailData);

      if (!createdBudgetDetailRes) {
        throw new Error(Messages.BUDGET_DETAILS_CREATE_FAILED);
      }
      createdBudgets.push(newBudget);
    }

    return createdBudgets;
  }

  async getAnnualBudgetByYears(params: BudgetGetAnnualYearParams) {
    const { userId, cursor = null, take, currency, search, filters } = params;
    // filter format is like ['2023', '2024'] => search by fiscalYear in range

    const currentYear = new Date().getFullYear(); // 2025

    const now = new Date();

    let where = {
      userId,
    } as Prisma.BudgetsTableWhereInput;

    if (filters) {
      const whereClause = buildWhereClause(filters);
      where = { ...where, ...whereClause };
    }

    where.fiscalYear = {
      lte: currentYear,
      ...(cursor && { lt: cursor }),
      ...(where.fiscalYear && typeof where.fiscalYear === 'object' ? where.fiscalYear : {}),
    };

    if (search) {
      where.fiscalYear = {
        equals: Number(search),
      };
    }

    // Step 1.1: Check if budgets exist for the current year
    const currentYearBudgets = await this.budgetRepository.findManyBudgetData(
      {
        userId: userId,
        fiscalYear: currentYear,
      },
      {
        select: {
          fiscalYear: true,
          type: true,
        },
      },
    );

    // Step 2.1: If no budgets for the current year, create them
    if (currentYearBudgets.length === 0) {
      // Find the least recent past year's budgets (if current year is 2025 => get 2024 )
      const defaultIcon = 'banknote';

      const latestPastBudgets = await this.budgetRepository.findManyBudgetData(
        {
          userId: userId,
          fiscalYear: {
            lte: currentYear, // Allow up to next year,
          },
        },
        {
          select: {
            fiscalYear: true,
            type: true,
            total_inc: true,
            total_exp: true,
            description: true,
            currency: true,
          },
          orderBy: { fiscalYear: 'desc' },
          take: 3, // Get budgets for the most recent year (Top, Bot, Act)
        },
      );

      if (latestPastBudgets.length > 0) {
        const topBudget = latestPastBudgets.find((b) => b.type === BudgetType.Top);
        const currency = topBudget?.currency || Currency.VND; // Default to VND if not found
        const description = topBudget?.description || 'Auto-generated bud get';

        // Create budgets for the current year using the most recent past year's data
        // For Act, createBudget will fetch current year's transactions
        await this.createBudget({
          userId: userId,
          fiscalYear: currentYear, // Use current year
          estimatedTotalExpense: topBudget!.total_exp.toNumber() || 0,
          estimatedTotalIncome: topBudget!.total_inc.toNumber() || 0,
          description: description,
          currency: currency, // Use the currency from the latest past budget
          icon: topBudget?.icon ?? defaultIcon,
          isSystemGenerated: true,
        });
      } else {
        const defaultDescription = 'Auto-generated budget';

        const defaultEstimatedTotalExpense = 0;
        const defaultEstimatedTotalIncome = 0;

        await this.createBudget({
          userId: userId,
          fiscalYear: currentYear, // Use current year
          estimatedTotalExpense: defaultEstimatedTotalExpense,
          estimatedTotalIncome: defaultEstimatedTotalIncome,
          description: defaultDescription,
          currency: currency, // Use the currency from the user preference
          icon: defaultIcon,
          isSystemGenerated: true,
        });
      }
    }

    // Step 3: Fetch distinct years with budgets, sorted descending
    const distinctYears = await this.budgetRepository.findManyBudgetData(where, {
      select: {
        fiscalYear: true,
      },
      distinct: ['fiscalYear'], // Get unique years
      orderBy: {
        fiscalYear: 'desc',
      },
      take: take, // Take 3 distinct years
    });

    const years = distinctYears.map((d) => d.fiscalYear);

    // Step 4: Fetch budgets for the user with pagination, from current year and earlier
    const budgets = await this.budgetRepository.findManyBudgetData(where, {
      select: {
        id: true,
        fiscalYear: true,
        total_inc: true,
        total_exp: true,
        currency: true,
        createdAt: true,
        type: true,
      },
      orderBy: {
        fiscalYear: 'desc', // Sort by year in descending order
      },
    });

    const currentMonth = now.getMonth() + 1; // 1-12
    const previousMonth = currentMonth - 1; // Tháng trước
    const previousMonthStart = new Date(now.getFullYear(), previousMonth - 1, 1); // Ngày 1 của tháng trước

    // Step 5 : Calculate the total of tentative actual transactions
    const tentativeTransactions = await this.transactionRepository.findManyTransactions(
      {
        userId: userId,
        isDeleted: false,
        date: {
          gte: previousMonthStart, // Từ ngày 1 của tháng trước
          lte: now, // Đến hiện tại
        },
        type: { in: [TransactionType.Income, TransactionType.Expense] },
      },
      {
        select: {
          date: true,
          type: true,
          amount: true,
          currency: true,
        },
      },
    );

    // Step 6: Process transactions to calculate tentative income/expense per year
    const tentativeTotalsByYear = tentativeTransactions.reduce(
      (
        acc: Record<string, { currency: string; total_exp: number; total_inc: number }>,
        transaction,
      ) => {
        const year = transaction.date.getFullYear();
        const key = `${year}-${transaction.currency}`;
        if (!acc[key]) {
          acc[key] = { currency: transaction.currency, total_exp: 0, total_inc: 0 };
        }
        if (transaction.type === TransactionType.Expense) {
          acc[key].total_exp += convertCurrency(
            transaction.amount,
            transaction.currency as Currency,
            currency,
          );
        } else if (transaction.type === TransactionType.Income) {
          acc[key].total_inc += convertCurrency(
            transaction.amount,
            transaction.currency as Currency,
            currency,
          );
        }
        return acc;
      },
      {},
    );

    // Step 7: Group budgets by year and extract Top, Bot, Act
    const budgetsByYear = budgets.reduce(
      (
        acc: Record<number, Record<string, { total_inc: any; total_exp: any; currency: string }>>,
        budget,
      ) => {
        if (!acc[budget.fiscalYear]) {
          acc[budget.fiscalYear] = {};
        }
        acc[budget.fiscalYear][budget.type] = {
          total_inc: budget.total_inc,
          total_exp: budget.total_exp,
          currency: budget.currency,
        };
        return acc;
      },
      {},
    );

    // Step 8: Filter out budgets that are not in the distinct years
    const response = years.map((year) => {
      const budgetData = budgetsByYear[year] || {};
      const topData = budgetData[BudgetType.Top] || {
        total_inc: 0,
        total_exp: 0,
        currency: Currency.VND,
      };
      const botData = budgetData[BudgetType.Bot] || {
        total_inc: 0,
        total_exp: 0,
        currency: Currency.VND,
      };
      const actData = budgetData[BudgetType.Act] || {
        total_inc: 0,
        total_exp: 0,
        currency: Currency.VND,
      };

      const tentativeKey = `${year}-${actData.currency}`;
      const tentativeTotals = tentativeTotalsByYear[tentativeKey] || {
        total_exp: 0,
        total_inc: 0,
        currency: actData.currency,
      };

      const combinedActIncome =
        convertCurrency(actData.total_inc, actData.currency as Currency, currency) +
        tentativeTotals.total_inc;

      const combinedActExpense =
        convertCurrency(actData.total_exp, actData.currency as Currency, currency) +
        tentativeTotals.total_exp;

      return {
        year: year,
        budgetTopIncome: convertCurrency(topData.total_inc, topData.currency as Currency, currency),
        budgetTopExpense: convertCurrency(
          topData.total_exp,
          topData.currency as Currency,
          currency,
        ),
        budgetBotIncome: convertCurrency(botData.total_inc, botData.currency as Currency, currency),
        budgetBotExpense: convertCurrency(
          botData.total_exp,
          botData.currency as Currency,
          currency,
        ),
        budgetActIncome: combinedActIncome,
        budgetActExpense: combinedActExpense,
        actualIncome: convertCurrency(actData.total_inc, actData.currency as Currency, currency),
        actualExpense: convertCurrency(actData.total_exp, actData.currency as Currency, currency),
        tentativeTotalsIncome: tentativeTotals.total_inc,
        tentativeTotalsExpense: tentativeTotals.total_exp,
      };
    });

    // Step 9: Include the next cursor in the response
    const nextCursor = response.length === take ? response[response.length - 1].year : null;

    return {
      data: response,
      nextCursor,
      currency: currency,
    } as const;
  }

  async updateActBudget(
    userId: string,
    fiscalYear: number,
    currency: Currency,
    targetMonth?: number,
  ) {
    const now = new Date();
    const currentMonth = targetMonth || now.getMonth() + 1; // Sử dụng targetMonth nếu được cung cấp, nếu không lấy từ now
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Cách hiện tại 30 ngày

    // Bước 1: Nếu là tháng 1 hoặc 2, actual sum-up = 0
    if (currentMonth <= 2) {
      await prisma.budgetsTable.upsert({
        where: {
          fiscalYear_type_userId: {
            userId: userId,
            fiscalYear: fiscalYear,
            type: 'Act',
          },
        },
        update: {
          total_exp: 0,
          total_inc: 0,
          h1_exp: 0,
          h2_exp: 0,
          h1_inc: 0,
          h2_inc: 0,
          q1_exp: 0,
          q2_exp: 0,
          q3_exp: 0,
          q4_exp: 0,
          q1_inc: 0,
          q2_inc: 0,
          q3_inc: 0,
          q4_inc: 0,
          m1_exp: 0,
          m1_inc: 0,
          m2_exp: 0,
          m2_inc: 0,
          m3_exp: 0,
          m3_inc: 0,
          m4_exp: 0,
          m4_inc: 0,
          m5_exp: 0,
          m5_inc: 0,
          m6_exp: 0,
          m6_inc: 0,
          m7_exp: 0,
          m7_inc: 0,
          m8_exp: 0,
          m8_inc: 0,
          m9_exp: 0,
          m9_inc: 0,
          m10_exp: 0,
          m10_inc: 0,
          m11_exp: 0,
          m11_inc: 0,
          m12_exp: 0,
          m12_inc: 0,
          updatedAt: now,
          updatedBy: userId,
        },
        create: {
          userId: userId,
          fiscalYear: fiscalYear,
          type: 'Act',
          total_exp: 0,
          total_inc: 0,
          h1_exp: 0,
          h2_exp: 0,
          h1_inc: 0,
          h2_inc: 0,
          q1_exp: 0,
          q2_exp: 0,
          q3_exp: 0,
          q4_exp: 0,
          q1_inc: 0,
          q2_inc: 0,
          q3_inc: 0,
          q4_inc: 0,
          m1_exp: 0,
          m1_inc: 0,
          m2_exp: 0,
          m2_inc: 0,
          m3_exp: 0,
          m3_inc: 0,
          m4_exp: 0,
          m4_inc: 0,
          m5_exp: 0,
          m5_inc: 0,
          m6_exp: 0,
          m6_inc: 0,
          m7_exp: 0,
          m7_inc: 0,
          m8_exp: 0,
          m8_inc: 0,
          m9_exp: 0,
          m9_inc: 0,
          m10_exp: 0,
          m10_inc: 0,
          m11_exp: 0,
          m11_inc: 0,
          m12_exp: 0,
          m12_inc: 0,
          currency: currency,
          createdBy: userId,
          description: 'Auto-generated Act budget',
        },
      });
      return;
    }

    // Bước 2: Tính toán giao dịch từ tháng 1 đến tháng trước (currentMonth - 1)
    let totalExpense = 0;
    let totalIncome = 0;

    // Lặp qua các tháng từ tháng 1 đến tháng trước (currentMonth - 1)
    for (let month = 1; month <= currentMonth - 1; month++) {
      const monthStart = new Date(fiscalYear, month - 1, 1); // Ngày 1 của tháng
      const monthEnd = new Date(fiscalYear, month, 0); // Ngày cuối của tháng

      const transactions = await prisma.transaction.findMany({
        where: {
          userId: userId,
          isDeleted: false,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
          createdAt: {
            lte: thirtyDaysAgo, // Chỉ lấy giao dịch đã locked
          },
          type: { in: ['Income', 'Expense'] },
          currency: currency,
        },
        select: {
          type: true,
          amount: true,
        },
      });

      const monthExpense = transactions
        .filter((t) => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount.toNumber(), 0);

      const monthIncome = transactions
        .filter((t) => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount.toNumber(), 0);

      totalExpense += monthExpense;
      totalIncome += monthIncome;
    }

    // Bước 3: Phân bổ giá trị cho các trường tháng, quý, nửa năm
    const monthlyExpense = Number((totalExpense / 12).toFixed(2));
    const monthlyIncome = Number((totalIncome / 12).toFixed(2));

    const monthFields = Array.from({ length: 12 }, (_, i) => i + 1).reduce<Record<string, number>>(
      (acc, m) => {
        acc[`m${m}_exp`] = monthlyExpense;
        acc[`m${m}_inc`] = monthlyIncome;
        return acc;
      },
      {},
    );

    const quarterFields = {
      q1_exp: monthlyExpense * 3,
      q2_exp: monthlyExpense * 3,
      q3_exp: monthlyExpense * 3,
      q4_exp: monthlyExpense * 3,
      q1_inc: monthlyIncome * 3,
      q2_inc: monthlyIncome * 3,
      q3_inc: monthlyIncome * 3,
      q4_inc: monthlyIncome * 3,
    };

    const h1_exp = monthlyExpense * 6;
    const h2_exp = monthlyExpense * 6;
    const h1_inc = monthlyIncome * 6;
    const h2_inc = monthlyIncome * 6;

    // Bước 4: Cập nhật hoặc tạo ngân sách Act
    await prisma.budgetsTable.upsert({
      where: {
        fiscalYear_type_userId: {
          userId: userId,
          fiscalYear: fiscalYear,
          type: 'Act',
        },
      },
      update: {
        total_exp: totalExpense,
        total_inc: totalIncome,
        h1_exp,
        h2_exp,
        h1_inc,
        h2_inc,
        ...quarterFields,
        ...monthFields,
        updatedAt: now,
        updatedBy: userId,
      },
      create: {
        userId: userId,
        fiscalYear: fiscalYear,
        type: 'Act',
        total_exp: totalExpense,
        total_inc: totalIncome,
        h1_exp,
        h2_exp,
        h1_inc,
        h2_inc,
        ...quarterFields,
        ...monthFields,
        currency: currency,
        createdBy: userId,
        description: 'Auto-generated Act budget',
      },
    });
  }

  async updateActBudgetTotalYears(userId: string, currency: Currency) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Cách hiện tại 30 ngày

    // // Chỉ cập nhật vào ngày 1 của tháng
    // if (now.getDate() !== 1) {
    //   return; // Không thực hiện nếu không phải ngày 1
    // }

    // Bước 1: Lấy danh sách các năm có giao dịch
    const yearsWithTransactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        isDeleted: false,
        currency: currency,
      },
      select: {
        date: true,
      },
      distinct: ['date'],
    });

    const uniqueYears = [...new Set(yearsWithTransactions.map((t) => t.date.getFullYear()))];

    for (const fiscalYear of uniqueYears) {
      const isCurrentYear = fiscalYear === currentYear;
      const currentMonth = now.getMonth() + 1; // 1-12
      const targetMonth = isCurrentYear ? currentMonth - 2 : 12; // Với năm quá khứ, lấy toàn bộ năm (tháng 12)

      // Tháng 1 và 2: actual sum-up = 0
      if (isCurrentYear && targetMonth < 1) {
        continue;
      }

      // Kiểm tra xem ngân sách loại 'Act' đã tồn tại chưa
      const existingBudget = await this.budgetRepository.findBudgetData(
        {
          userId,
          fiscalYear,
          type: BudgetType.Act,
        },
        {
          select: {
            id: true,
            total_exp: true,
            total_inc: true,
            currency: true,
          },
        },
      );

      if (!existingBudget) {
        continue; // Bỏ qua nếu không có ngân sách để cập nhật
      }

      // ----------------------- UPDATE ACT BUDGET AT YEAR -----------------------
      // Xác định phạm vi từ đầu năm đến cuối tháng target
      // Xác định phạm vi từ đầu năm đến cuối tháng target
      const yearStart = new Date(fiscalYear, 0, 1); // Ngày 1/1 của năm
      const targetMonthEnd = new Date(fiscalYear, targetMonth, 0); // Ngày cuối của tháng target (hoặc cuối năm)

      // ----------------------- UPDATE ACT BUDGET AT MONTH -----------------------
      // Xác định phạm vi của tháng target (tháng cách đó 2 tháng)
      // const targetMonthStart = new Date(fiscalYear, targetMonth - 1, 1); // Ngày 1 của tháng target
      // const targetMonthEnd = new Date(fiscalYear, targetMonth, 0); // Ngày cuối của tháng target

      // Lấy ngày nhỏ hơn giữa targetMonthEnd và thirtyDaysAgo
      const effectiveEndDate = targetMonthEnd < thirtyDaysAgo ? targetMonthEnd : thirtyDaysAgo;

      // Lấy giao dịch của tháng trước đã "locked"
      const transactions = await this.transactionRepository.findManyTransactions(
        {
          userId,
          date: {
            gte: yearStart,
            lte: effectiveEndDate, // Đảm bảo date nằm trong tháng trước và đã "locked"
          },
          isDeleted: false,
          type: {
            in: [TransactionType.Expense, TransactionType.Income],
          },
        },
        {
          select: {
            date: true,
            type: true,
            amount: true,
            currency: true,
          },
        },
      );

      // Tính tổng giao dịch của tháng target
      let monthExpense = 0;
      let monthIncome = 0;

      transactions.forEach((t) => {
        const amount = convertCurrency(t.amount, t.currency as Currency, currency);
        if (t.type === TransactionType.Expense) {
          monthExpense += amount;
        } else if (t.type === TransactionType.Income) {
          monthIncome += amount;
        }
      });

      // Tính quý và nửa năm dựa trên phân bổ 12 tháng
      const quarters = {
        q1: [1, 2, 3],
        q2: [4, 5, 6],
        q3: [7, 8, 9],
        q4: [10, 11, 12],
      };

      const monthlyExpense = _.round(monthExpense / 12, 2); // calculate with 2 decimal places
      const monthlyIncome = _.round(monthIncome / 12, 2); // calculate with 2 decimal places

      // Create budget details for each month
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      // Monthly fields split into 12 months
      const monthFields = months.reduce<Record<string, number>>((acc, m) => {
        acc[`m${m}_exp`] = monthlyExpense;
        acc[`m${m}_inc`] = monthlyIncome;
        return acc;
      }, {});

      // Quarterly fields
      const quarterFields = Object.entries(quarters).reduce<Record<string, number>>(
        (acc, [q, ms]) => {
          acc[`${q}_exp`] = _.round(ms.length * monthlyExpense, 2); // by multiplying by 3 months with monthlyExpense
          acc[`${q}_inc`] = _.round(ms.length * monthlyIncome, 2); // by multiplying by 3 months with monthlyIncome
          return acc;
        },
        {},
      );

      // Half-year totals
      const h1_exp = _.round(monthlyExpense * 6, 2); // 6 months in half-year
      const h2_exp = _.round(monthlyExpense * 6, 2); // 6 months in half-year
      const h1_inc = _.round(monthlyIncome * 6, 2); // 6 months in half-year
      const h2_inc = _.round(monthlyIncome * 6, 2); // 6 months in half-year

      // Step 3: Chỉ cập nhật ngân sách đã có
      const updatedBudget = await this.budgetRepository.updateBudget(
        {
          fiscalYear_type_userId: {
            userId,
            fiscalYear,
            type: BudgetType.Act,
          },
        },
        {
          total_exp: monthExpense,
          total_inc: monthIncome,
          h1_exp,
          h2_exp,
          h1_inc,
          h2_inc,
          ...quarterFields,
          ...monthFields,
          currency,
          updatedBy: userId,
        },
      );

      if (!updatedBudget) {
        throw new Error(Messages.BUDGET_UPDATE_FAILED);
      }
    }
  }

  async checkedDuplicated(userId: string, fiscalYear: number): Promise<boolean> {
    const foundBudget = await this.budgetRepository.findBudgetData({
      userId,
      fiscalYear,
    });
    if (foundBudget) {
      return true;
    }
    return false;
  }
}

export const budgetUseCase = new BudgetUseCase(
  budgetRepository,
  budgetDetailRepository,
  transactionRepository,
);
