import { prisma } from '@/config';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import {
  BudgetAllocation,
  BudgetCreationParams,
  BudgetTypeData,
  BudgetUpdateParams,
  FetchTransactionResponse,
} from '@/shared/types/budget.types';
import { buildWhereClause } from '@/shared/utils';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import {
  BudgetsTable,
  BudgetType,
  Currency,
  Prisma,
  PrismaClient,
  Transaction,
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

  private async calculateActTotals(
    userId: string,
    fiscalYear: number,
    currency: Currency,
    now: Date,
  ): Promise<{ totalExpense: number; totalIncome: number }> {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    let targetMonthEnd: Date;

    const yearStart = new Date(`${fiscalYear}-01-01`);

    if (fiscalYear === currentYear) {
      const targetMonth = currentMonth - 2;
      if (targetMonth < 1) {
        targetMonthEnd = yearStart;
      } else {
        targetMonthEnd = new Date(fiscalYear, targetMonth, 0);
      }
    } else {
      targetMonthEnd = new Date(`${fiscalYear}-12-31`);
    }

    const effectiveEndDate = targetMonthEnd < thirtyDaysAgo ? targetMonthEnd : thirtyDaysAgo;

    const transactions = await this.transactionRepository.findManyTransactions(
      {
        userId,
        date: { gte: yearStart, lte: effectiveEndDate },
        isDeleted: false,
        type: { in: [TransactionType.Expense, TransactionType.Income] },
      },
      { select: { type: true, amount: true, currency: true } },
    );

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);

    return { totalExpense, totalIncome };
  }

  private calculateBudgetAllocation(totalExpense: number, totalIncome: number): BudgetAllocation {
    // Create budget details for each month
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Quarterly fields
    const quarters = { q1: [1, 2, 3], q2: [4, 5, 6], q3: [7, 8, 9], q4: [10, 11, 12] };

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

    return {
      monthFields,
      quarterFields,
      halfYearFields: { h1_exp, h2_exp, h1_inc, h2_inc },
      monthlyExpense,
      monthlyIncome,
    };
  }

  // =============== CREATE BUDGET VERSION 2 WITH TRANSACTION ==============
  private async createSingleBudget(
    prisma: Prisma.TransactionClient,
    userId: string,
    fiscalYear: number,
    { type, totalExpense, totalIncome }: BudgetTypeData,
    { description, icon, currency, isSystemGenerated }: Partial<BudgetCreationParams>,
  ): Promise<BudgetsTable> {
    const { monthFields, quarterFields, halfYearFields } = this.calculateBudgetAllocation(
      totalExpense,
      totalIncome,
    );

    const newBudget = await prisma.budgetsTable.create({
      data: {
        userId,
        icon,
        fiscalYear,
        type,
        total_exp: totalExpense,
        total_inc: totalIncome,
        ...halfYearFields,
        ...quarterFields,
        ...monthFields,
        createdBy: !isSystemGenerated ? userId : undefined,
        description,
        currency,
      },
    });

    if (!newBudget || !newBudget.id) {
      throw new Error(Messages.BUDGET_CREATE_FAILED);
    }

    return newBudget;
  }

  private calculateActualTotals(
    transactions: FetchTransactionResponse[] | [],
    currency: Currency,
  ): { totalExpenseAct: number; totalIncomeAct: number } {
    const totalExpenseAct = transactions
      .filter((t) => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);

    const totalIncomeAct = transactions
      .filter((t) => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);
    return { totalExpenseAct, totalIncomeAct };
  }

  private calculateTransactionRange(fiscalYear: number): {
    yearStart: Date;
    effectiveEndDate: Date;
  } {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const yearStart = new Date(`${fiscalYear}-01-01`);
    let targetMonthEnd: Date;

    if (fiscalYear === currentYear) {
      const targetMonth = currentMonth - 2;
      targetMonthEnd = targetMonth < 1 ? yearStart : new Date(fiscalYear, targetMonth, 0);
    } else {
      targetMonthEnd = new Date(`${fiscalYear}-12-31`);
    }

    const effectiveEndDate = targetMonthEnd < thirtyDaysAgo ? targetMonthEnd : thirtyDaysAgo;
    return { yearStart, effectiveEndDate };
  }

  private async fetchTransactionsTx(
    userId: string,
    yearStart: Date,
    effectiveEndDate: Date,
    prisma: Prisma.TransactionClient,
  ): Promise<FetchTransactionResponse[] | []> {
    return await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: yearStart,
          lte: effectiveEndDate,
        },
        isMarked: false,
        isDeleted: false,
        type: {
          in: [TransactionType.Expense, TransactionType.Income],
        },
      },
      select: {
        id: true,
        type: true,
        amount: true,
        currency: true,
      },
    });
  }

  private calculateActualTotals(
    transactions: FetchTransactionResponse[] | [],
    currency: Currency,
  ): { totalExpenseAct: number; totalIncomeAct: number } {
    const totalExpenseAct = transactions
      .filter((t) => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);

    const totalIncomeAct = transactions
      .filter((t) => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);
    return { totalExpenseAct, totalIncomeAct };
  }

  private calculateBudgetAllocation(totalExpense: number, totalIncome: number): BudgetAllocation {
    // Create budget details for each month
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Quarterly fields
    const quarters = {
      q1: [1, 2, 3],
      q2: [4, 5, 6],
      q3: [7, 8, 9],
      q4: [10, 11, 12],
    };

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

    return {
      monthFields,
      quarterFields,
      halfYearFields: { h1_exp, h2_exp, h1_inc, h2_inc },
      monthlyExpense,
      monthlyIncome,
    };
  }

  private async createSingleBudget(
    prisma: Prisma.TransactionClient,
    userId: string,
    fiscalYear: number,
    { type, totalExpense, totalIncome }: BudgetTypeData,
    { description, icon, currency, isSystemGenerated }: Partial<BudgetCreationParams>,
  ): Promise<BudgetsTable> {
    const { monthFields, quarterFields, halfYearFields, monthlyExpense, monthlyIncome } =
      this.calculateBudgetAllocation(totalExpense, totalIncome);

    const newBudget = await prisma.budgetsTable.create({
      data: {
        userId,
        icon,
        fiscalYear,
        type,
        total_exp: totalExpense,
        total_inc: totalIncome,
        ...halfYearFields,
        ...quarterFields,
        ...monthFields,
        createdBy: !isSystemGenerated ? userId : undefined,
        description,
        currency,
      },
    });

    if (!newBudget || !newBudget.id) {
      throw new Error(Messages.BUDGET_CREATE_FAILED);
    }

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

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

    const createdBudgetDetailRes = await prisma.budgetDetails.createManyAndReturn({
      data: detailData,
      skipDuplicates: true,
    });

    if (!createdBudgetDetailRes) {
      throw new Error(Messages.BUDGET_DETAILS_CREATE_FAILED);
    }

    return newBudget;
  }

  // =============== CREATE BUDGET VERSION 2 WITH TRANSACTION ==============

  async createBudgetTransaction(params: BudgetCreationParams): Promise<BudgetsTable[]> {
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

    // checked whether fiscalYear was in the past or not
    const currentYear = new Date().getFullYear();
    if (fiscalYear < currentYear) {
      throw new Error(Messages.BUDGET_PAST_YEAR_NOT_ALLOWED);
    }

    return await prisma.$transaction(async (prisma) => {
      const { yearStart, effectiveEndDate } = this.calculateTransactionRange(fiscalYear);

      const transactions = await this.fetchTransactionsTx(
        userId,
        yearStart,
        effectiveEndDate,
        prisma,
      );

      const { totalExpenseAct, totalIncomeAct } = this.calculateActualTotals(
        transactions || [],
        currency,
      );

      const budgetTypesData: BudgetTypeData[] = [
        { type: 'Top', totalExpense: estimatedTotalExpense, totalIncome: estimatedTotalIncome },
        { type: 'Bot', totalExpense: 0, totalIncome: 0 },
        { type: 'Act', totalExpense: totalExpenseAct, totalIncome: totalIncomeAct },
      ];

      const createdBudgets: BudgetsTable[] = [];

      for (const budgetTypeData of budgetTypesData) {
        const budget = await this.createSingleBudget(prisma, userId, fiscalYear, budgetTypeData, {
          description,
          icon,
          currency,
          isSystemGenerated,
        });
        createdBudgets.push(budget);
      }

      const transactionIds = transactions.map((t) => t.id);
      if (transactionIds.length > 0) {
        await prisma.transaction.updateMany({
          where: {
            id: { in: transactionIds },
          },
          data: {
            isMarked: true,
          },
        });
      }

      return createdBudgets;
    });
  }

  // =============== UPDATE BUDGET VERSION 2 WITH TRANSACTION ==============
  // update budget top bot
  async updateBudgetTransaction(params: BudgetUpdateParams): Promise<BudgetsTable> {
    const {
      budgetId,
      userId,
      fiscalYear,
      description,
      estimatedTotalExpense,
      estimatedTotalIncome,
      icon,
      currency,
      type,
    } = params;

    // update budget top bot
    return await prisma.$transaction(async (prisma) => {
      // calculate transaction range
      const { yearStart, effectiveEndDate } = this.calculateTransactionRange(fiscalYear);

      // fetch transactions
      const transactions = await this.fetchTransactionsTx(
        userId,
        yearStart,
        effectiveEndDate,
        prisma,
      );

      // calculate actual totals
      const { totalExpenseAct, totalIncomeAct } = this.calculateActualTotals(
        transactions || [],
        currency,
      );

      // calculate budget type data
      const budgetTypeData: BudgetTypeData = {
        type,
        totalExpense: type === 'Act' ? totalExpenseAct : estimatedTotalExpense,
        totalIncome: type === 'Act' ? totalIncomeAct : estimatedTotalIncome,
      };

      // update budget
      const budget = await this.updateSingleBudget(
        prisma,
        userId,
        fiscalYear,
        budgetId,
        budgetTypeData,
        {
          description,
          icon,
          currency,
        },
      );

      // return budget
      return budget;
    });
  }

  private async updateSingleBudget(
    prisma: Prisma.TransactionClient,
    userId: string,
    fiscalYear: number,
    budgetId: string,
    { type, totalExpense, totalIncome }: BudgetTypeData,
    { description, icon, currency }: Partial<BudgetCreationParams>,
  ) {
    // Check if budget exists
    const existingBudget = await prisma.budgetsTable.findUnique({
      where: {
        id: budgetId,
        type: type as BudgetType,
      },
    });

    if (!existingBudget) {
      throw new Error(Messages.BUDGET_NOT_FOUND);
    }

    const { monthFields, quarterFields, halfYearFields } = this.calculateBudgetAllocation(
      totalExpense,
      totalIncome,
    );

    const updatedBudget = await prisma.budgetsTable.update({
      where: {
        id: budgetId,
        type: type as BudgetType,
      },
      data: {
        total_exp: totalExpense,
        total_inc: totalIncome,
        ...halfYearFields,
        ...quarterFields,
        ...monthFields,
        description,
        icon,
        currency,
        updatedBy: userId,
      },
    });

    if (!updatedBudget) {
      throw new Error(Messages.BUDGET_UPDATE_FAILED);
    }

    return updatedBudget;
  }

  // ======================= CREATE BUDGET VERSION 1 =======================
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
      type,
      skipActCalculation = false,
    } = params;

    const now = new Date();

    const budgetTypes = type ? [type] : (['Top', 'Bot', 'Act'] as BudgetsTable['type'][]);

    const createdBudgets: BudgetsTable[] = [];

    for (const budgetType of budgetTypes) {
      let totalExpense = estimatedTotalExpense;
      let totalIncome = estimatedTotalIncome;

      if (budgetType === BudgetType.Act && !skipActCalculation) {
        const { totalExpense: actExpense, totalIncome: actIncome } = await this.calculateActTotals(
          userId,
          fiscalYear,
          currency,
          now,
        );
        totalExpense = actExpense;
        totalIncome = actIncome;
      }

      const { monthFields, quarterFields, halfYearFields } = this.calculateBudgetAllocation(
        totalExpense,
        totalIncome,
      );

      const { h1_exp, h2_exp, h1_inc, h2_inc } = halfYearFields;

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
    }

    return createdBudgets;
  }

  private async fetchTransactions(
    userId: string,
    yearStart: Date,
    effectiveEndDate: Date,
    additionalWhere: Prisma.TransactionWhereInput = {},
  ) {
    return await this.transactionRepository.findManyTransactions(
      {
        userId,
        date: { gte: yearStart, lte: effectiveEndDate },
        isDeleted: false,
        type: { in: [TransactionType.Income, TransactionType.Expense] },
        ...additionalWhere,
      },
      {
        select: { id: true, date: true, type: true, amount: true, currency: true },
      },
    );
  }

  async getAnnualBudgetByYears(params: BudgetGetAnnualYearParams) {
    const { userId, cursor = null, take, currency, search, filters } = params;

    const currentYear = new Date().getFullYear();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let where = {
      userId,
    } as Prisma.BudgetsTableWhereInput;

    if (filters) {
      const whereClause = buildWhereClause(filters);
      where = { ...where, ...whereClause };
    }

    // Adjust the fiscalYear filter to allow past and future years
    where.fiscalYear = {
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
      { userId, fiscalYear: currentYear },
      { select: { fiscalYear: true, type: true } },
    );

    // Step 2.1: If no budgets for the current year, create them
    if (currentYearBudgets.length === 0) {
      // Find the least recent past year's budgets (if current year is 2025 => get 2024 )
      const defaultIcon = 'banknote';
      const defaultDescription = 'Auto-generated budget';

      let actEstimatedTotalExpense = 0;
      let actEstimatedTotalIncome = 0;

      let budgetCurrency = currency;
      let budgetDescription = defaultDescription;
      let budgetIcon = defaultIcon;

      // Tìm năm nhỏ nhất có ngân sách hoặc giao dịch
      const minBudgetYear = await this.budgetRepository.findBudgetData(
        { userId, type: BudgetType.Act },
        { select: { fiscalYear: true }, orderBy: { fiscalYear: 'asc' } },
      );

      const minTransactionYear = await this.transactionRepository.findFirstTransaction(
        { userId, isDeleted: false, isMarked: false },
        { select: { date: true }, orderBy: { date: 'asc' } },
      );

      // Xác định năm nhỏ nhất có dữ liệu
      const minBudgetYearValue = minBudgetYear ? minBudgetYear.fiscalYear : null;
      const minTransactionYearValue = minTransactionYear
        ? minTransactionYear.date.getFullYear()
        : null;

      let minYear: number | null = null;

      if (minBudgetYearValue && minTransactionYearValue) {
        minYear = Math.min(minBudgetYearValue, minTransactionYearValue);
      } else if (minBudgetYearValue) {
        minYear = minBudgetYearValue;
      } else if (minTransactionYearValue) {
        minYear = minTransactionYearValue;
      }

      // Nếu không có dữ liệu, đặt minYear là 10 năm trước (giới hạn hợp lý)
      minYear = minYear || currentYear - 10;

      // Lặp qua các năm trước đó để tìm dữ liệu
      let yearToCheck = currentYear - 1; // Bắt đầu từ năm ngoái (2024)
      let foundData = false;

      while (!foundData && yearToCheck >= minYear) {
        // Kiểm tra ngân sách Act của năm hiện tại
        const latestActBudget = await this.budgetRepository.findBudgetData(
          { userId, type: BudgetType.Act, fiscalYear: yearToCheck },
          {
            select: {
              fiscalYear: true,
              total_inc: true,
              total_exp: true,
              currency: true,
              description: true,
              icon: true,
            },
          },
        );

        if (latestActBudget) {
          // Copy dữ liệu từ Act năm gần nhất
          actEstimatedTotalExpense = latestActBudget.total_exp.toNumber();
          actEstimatedTotalIncome = latestActBudget.total_inc.toNumber();
          budgetCurrency = latestActBudget.currency;
          budgetDescription = latestActBudget.description || defaultDescription;
          budgetIcon = latestActBudget.icon || defaultIcon;
          foundData = true;
        } else {
          // Nếu không có ngân sách, lấy giao dịch của năm đó
          const yearStart = new Date(yearToCheck, 0, 1);
          const yearEnd = new Date(yearToCheck, 11, 31);
          const transactions = await this.fetchTransactions(userId, yearStart, yearEnd, {
            isMarked: false,
          });

          if (transactions.length > 0) {
            const { totalExpenseAct, totalIncomeAct } = this.calculateActualTotals(
              transactions,
              budgetCurrency,
            );
            actEstimatedTotalExpense = totalExpenseAct;
            actEstimatedTotalIncome = totalIncomeAct;

            // Đánh dấu giao dịch đã được tính
            const transactionIds = transactions.map((t) => t.id);
            if (transactionIds.length > 0) {
              await prisma.transaction.updateMany({
                where: { id: { in: transactionIds } },
                data: { isMarked: true },
              });
            }
            foundData = true;
          }
        }
        yearToCheck--; // Chuyển sang năm trước đó
      }

      // Thêm giao dịch của năm 2025 (chỉ từ cách 2 tháng)
      const currentMonth = now.getMonth() + 1; // 5 (Tháng 5)
      const targetMonth = currentMonth - 2; // 3 (Tháng 3)
      const currentYearStart = new Date(currentYear, targetMonth - 1, 1); // 01/03/2025
      const currentYearEnd = new Date(currentYear, 11, 31); // 31/12/2025
      const currentYearTransactions = await this.transactionRepository.findManyTransactions(
        {
          userId,
          isDeleted: false,
          date: { gte: currentYearStart, lte: currentYearEnd },
          isMarked: false,
          type: { in: [TransactionType.Income, TransactionType.Expense] },
        },
        { select: { id: true, date: true, type: true, amount: true, currency: true } },
      );

      const currentYearTotals = this.calculateActualTotals(currentYearTransactions, budgetCurrency);

      actEstimatedTotalExpense += currentYearTotals.totalExpenseAct;
      actEstimatedTotalIncome += currentYearTotals.totalIncomeAct;

      // Đánh dấu giao dịch năm 2025 đã được tính
      const currentYearTransactionIds = currentYearTransactions.map((t) => t.id);
      if (currentYearTransactionIds.length > 0) {
        await prisma.transaction.updateMany({
          where: { id: { in: currentYearTransactionIds } },
          data: { isMarked: true },
        });
      }

      // Tạo ngân sách Act cho năm 2025
      await this.createBudget({
        userId,
        fiscalYear: currentYear,
        estimatedTotalExpense: actEstimatedTotalExpense,
        estimatedTotalIncome: actEstimatedTotalIncome,
        description: budgetDescription,
        currency: budgetCurrency,
        icon: budgetIcon,
        isSystemGenerated: true,
        type: BudgetType.Act,
        skipActCalculation: true,
      });

      // Tạo ngân sách Top và Bot với giá trị mặc định 0
      await this.createBudget({
        userId,
        fiscalYear: currentYear,
        estimatedTotalExpense: 0,
        estimatedTotalIncome: 0,
        description: defaultDescription,
        currency: budgetCurrency,
        icon: defaultIcon,
        isSystemGenerated: true,
        type: BudgetType.Top,
        skipActCalculation: true,
      });

      await this.createBudget({
        userId,
        fiscalYear: currentYear,
        estimatedTotalExpense: 0,
        estimatedTotalIncome: 0,
        description: defaultDescription,
        currency: budgetCurrency,
        icon: defaultIcon,
        isSystemGenerated: true,
        type: BudgetType.Bot,
        skipActCalculation: true,
      });
    }

    // Step 3: Fetch distinct years with budgets, sorted descending
    const distinctYears = await this.budgetRepository.findManyBudgetData(where, {
      select: { fiscalYear: true },
      distinct: ['fiscalYear'],
      orderBy: { fiscalYear: 'desc' },
      take,
    });

    const years = distinctYears.map((d) => d.fiscalYear);

    // Step 4: Fetch budgets for the user
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
        fiscalYear: 'desc',
      },
    });

    // Step 5: Tính tentative actual transactions (chỉ lấy giao dịch "locked" và chưa được tính)
    const tentativeTransactions = await this.transactionRepository.findManyTransactions(
      {
        userId,
        isDeleted: false,
        date: { lte: thirtyDaysAgo },
        isMarked: false,
        type: { in: [TransactionType.Income, TransactionType.Expense] },
      },
      { select: { id: true, date: true, type: true, amount: true, currency: true } },
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

    // Step 5: Group budgets by year and extract Top, Bot, Act
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

    // Step 6: Prepare response data
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
        year,
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
      };
    });
    // Step 7: Include the next cursor in the response
    const nextCursor = response.length === take ? response[response.length - 1].year : null;

    return {
      data: response,
      nextCursor,
      currency: currency,
    } as const;
  }

  async updateActBudgetTotalYears(userId: string, currency: Currency) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Cách hiện tại 30 ngày

    // Bước 1: Lấy danh sách các năm có giao dịch
    const yearsWithTransactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        isDeleted: false,
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
            fiscalYear: true,
          },
        },
      );

      if (!existingBudget) {
        continue; // Bỏ qua nếu không có ngân sách để cập nhật
      }

      // ----------------------- UPDATE ACT BUDGET AT YEAR -----------------------
      // Xác định phạm vi từ đầu năm đến cuối tháng target
      const yearStart = new Date(fiscalYear, 0, 1); // Ngày 1/1 của năm
      const targetMonthEnd = new Date(fiscalYear, targetMonth, 0); // Ngày cuối của tháng target (hoặc cuối năm)

      const effectiveEndDate = targetMonthEnd < thirtyDaysAgo ? targetMonthEnd : thirtyDaysAgo;

      // Lấy giao dịch của tháng trước đã "locked"
      const newTransactions = await this.transactionRepository.findManyTransactions(
        {
          userId,
          date: {
            gte: yearStart,
            lte: effectiveEndDate, // Đảm bảo date nằm trong tháng trước và đã "locked"
          },
          isDeleted: false,
          isMarked: false,
          type: {
            in: [TransactionType.Expense, TransactionType.Income],
          },
        },
        { select: { date: true, type: true, amount: true, currency: true, id: true } },
      );

      if (newTransactions.length === 0) {
        continue; // Không có giao dịch mới để cập nhật
      }

      // Tính tổng giao dịch mới
      let newExpense = 0;
      let newIncome = 0;

      newTransactions.forEach((t) => {
        const amount = convertCurrency(t.amount, t.currency as Currency, existingBudget.currency);
        if (t.type === TransactionType.Expense) newExpense += amount;
        else if (t.type === TransactionType.Income) newIncome += amount;
      });

      // Tính tổng mới dựa trên ngân sách cũ + giao dịch mới
      const totalExpense = existingBudget.total_exp.toNumber() + newExpense;
      const totalIncome = existingBudget.total_inc.toNumber() + newIncome;

      // Tính quý và nửa năm dựa trên phân bổ 12 tháng
      const quarters = {
        q1: [1, 2, 3],
        q2: [4, 5, 6],
        q3: [7, 8, 9],
        q4: [10, 11, 12],
      };

      const monthlyExpense = _.round(totalExpense / 12, 2); // calculate with 2 decimal places

      const monthlyIncome = _.round(totalIncome / 12, 2); // calculate with 2 decimal places

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
      const h1_inc = _.round(monthlyIncome * 6, 2); // 6 months in half-year
      const h2_exp = _.round(monthlyExpense * 6, 2); // 6 months in half-year
      const h2_inc = _.round(monthlyIncome * 6, 2); // 6 months in half-year

      // Đánh dấu giao dịch mới
      const newTransactionIds = newTransactions.map((t) => t.id);

      if (newTransactionIds.length > 0) {
        await prisma.transaction.updateMany({
          where: { id: { in: newTransactionIds } },
          data: { isMarked: true },
        });
      }

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
          total_exp: totalExpense,
          total_inc: totalIncome,
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

  async updateActBudgetTransaction(userId: string, currency: Currency): Promise<void> {
    return await prisma.$transaction(async (prisma) => {
      const years = await this.getAllTransactionGroupByFiscalYears(prisma, userId);
      if (years.length === 0) return;

      for (const fiscalYear of years) {
        await this.updateBudgetForYear(prisma, userId, fiscalYear, currency);
      }
    });
  }

  private async getAllTransactionGroupByFiscalYears(
    prisma: any,
    userId: string,
  ): Promise<number[]> {
    const distinctYears = await prisma.transaction.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        date: true,
      },
      distinct: ['date'],
    });
    if (!distinctYears || distinctYears.length === 0) {
      return [];
    }
    const uniqueYears = [
      ...new Set(distinctYears.map((t: Transaction) => t.date.getFullYear())),
    ] as number[];

    return uniqueYears;
  }

  private async updateBudget(
    prisma: PrismaClient,
    userId: string,
    fiscalYear: number,
    currency: Currency,
    { totalExpense, totalIncome }: { totalExpense: number; totalIncome: number },
  ): Promise<void> {
    const { monthFields, quarterFields, halfYearFields } = this.calculateBudgetAllocation(
      totalExpense,
      totalIncome,
    );

    await prisma.budgetsTable.update({
      where: {
        fiscalYear_type_userId: { userId, fiscalYear, type: BudgetType.Act },
      },
      data: {
        total_exp: totalExpense,
        total_inc: totalIncome,
        ...halfYearFields,
        ...quarterFields,
        ...monthFields,
        currency,
      },
    });
  }

  private async updateBudgetForYear(
    prisma: any,
    userId: string,
    fiscalYear: number,
    currency: Currency,
  ): Promise<void> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const isCurrentYear = fiscalYear === currentYear;
    const targetMonth = isCurrentYear ? currentMonth - 2 : 12;

    if (isCurrentYear && targetMonth < 1) {
      return; // Không cập nhật nếu là tháng 1 hoặc 2
    }

    const { yearStart, effectiveEndDate } = this.calculateTransactionRange(fiscalYear);
    const transactions = await this.fetchTransactionsTx(
      userId,
      yearStart,
      effectiveEndDate,
      prisma,
    );

    if (!transactions || transactions.length === 0) {
      return; // Không có giao dịch nào để cập nhật
    }

    const { totalExpenseAct, totalIncomeAct } = this.calculateActualTotals(
      transactions || [],
      currency,
    );

    await this.updateBudget(prisma, userId, fiscalYear, currency, {
      totalExpense: totalExpenseAct,
      totalIncome: totalIncomeAct,
    });
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
