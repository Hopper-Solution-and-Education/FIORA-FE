import { prisma } from '@/config';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import {
  BudgetCreationParams,
  BudgetGetAnnualYearParams,
  BudgetSummaryByYear,
  BudgetTypeData,
  BudgetUpdateParams,
  FetchTransactionResponse,
} from '@/shared/types/budget.types';
import { buildWhereClause } from '@/shared/utils';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import {
  calculateBudgetAllocation,
  calculateSumUpAllocation,
  calculateTransactionRange,
} from '@/shared/utils/monthBudgetUtil';
import { Filter } from '@growthbook/growthbook';
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
import { IBudgetRepository } from '../../repositories/budgetRepository.interface';

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

    const totalExpense = await transactions
      .filter((t) => t.type === TransactionType.Expense)
      .reduce(
        async (sum, t) =>
          (await sum) + (await convertCurrency(t.amount.toNumber(), t.currency!, currency)),
        Promise.resolve(0),
      );

    const totalIncome = await transactions
      .filter((t) => t.type === TransactionType.Income)
      .reduce(
        async (sum, t) =>
          (await sum) + (await convertCurrency(t.amount.toNumber(), t.currency!, currency)),
        Promise.resolve(0),
      );

    return { totalExpense, totalIncome };
  }

  // =============== CREATE BUDGET VERSION 2 WITH TRANSACTION ==============
  private async createSingleBudget(
    prisma: Prisma.TransactionClient,
    userId: string,
    fiscalYear: number,
    budgetTypeData: BudgetTypeData,
    budgetCreationParams: Partial<BudgetCreationParams>,
    transactions?: FetchTransactionResponse[],
  ): Promise<BudgetsTable> {
    const { type, totalExpense, totalIncome } = budgetTypeData;
    const { description, icon, isSystemGenerated, currency, currencyId } = budgetCreationParams;

    const { monthFields, quarterFields, halfYearFields } =
      type === BudgetType.Act
        ? await calculateSumUpAllocation(transactions || [], currency!)
        : calculateBudgetAllocation(totalExpense, totalIncome);

    const newBudget = await prisma.budgetsTable.create({
      data: {
        userId,
        icon,
        fiscalYear: fiscalYear.toString(),
        type,
        total_exp: totalExpense,
        total_inc: totalIncome,
        ...halfYearFields,
        ...quarterFields,
        ...monthFields,
        createdBy: !isSystemGenerated ? userId : undefined,
        description,
        currencyId,
        currency,
      },
    });

    if (!newBudget || !newBudget.id) {
      throw new Error(Messages.BUDGET_CREATE_FAILED);
    }

    return newBudget;
  }

  private async calculateActualTotals(
    transactions: FetchTransactionResponse[] | [],
    currency: string,
  ): Promise<{ totalExpenseAct: number; totalIncomeAct: number }> {
    // Helper to sum converted amounts for a given transaction type
    const sumConvertedAmounts = async (type: TransactionType) => {
      const filtered = transactions.filter((t) => t.type === type);
      const convertedAmounts = await Promise.all(
        filtered.map((t) => convertCurrency(t.amount.toNumber(), t.currency!, currency)),
      );
      return convertedAmounts.reduce((sum, val) => sum + val, 0);
    };

    const [totalExpenseAct, totalIncomeAct] = await Promise.all([
      sumConvertedAmounts(TransactionType.Expense),
      sumConvertedAmounts(TransactionType.Income),
    ]);

    return { totalExpenseAct, totalIncomeAct };
  }

  private async calculateActualBudgetAccumulatedTotals(
    transactions: FetchTransactionResponse[] | [],
    currency: string,
    budget: BudgetsTable,
  ): Promise<{ totalExpenseAct: number; totalIncomeAct: number }> {
    // Refactored to use Promise.all for clarity and efficiency
    const expenseTransactions = transactions.filter((t) => t.type === TransactionType.Expense);
    const incomeTransactions = transactions.filter((t) => t.type === TransactionType.Income);

    const totalExpenseActAppend = (
      await Promise.all(
        expenseTransactions.map((t) => convertCurrency(t.amount.toNumber(), t.currency!, currency)),
      )
    ).reduce((sum, val) => sum + val, 0);

    const totalIncomeActAppend = (
      await Promise.all(
        incomeTransactions.map((t) => convertCurrency(t.amount.toNumber(), t.currency!, currency)),
      )
    ).reduce((sum, val) => sum + val, 0);

    const totalExpenseActAccumulated = await convertCurrency(
      budget.total_exp.toNumber(),
      budget.currency!,
      currency,
    );
    const totalIncomeActAccumulated = await convertCurrency(
      budget.total_inc.toNumber(),
      budget.currency!,
      currency,
    );

    const totalExpenseAct = totalExpenseActAccumulated + totalExpenseActAppend;
    const totalIncomeAct = totalIncomeActAccumulated + totalIncomeActAppend;

    return { totalExpenseAct, totalIncomeAct };
  }

  // =============== CREATE BUDGET VERSION 2 WITH TRANSACTION ==============

  async createBudgetTransaction(params: BudgetCreationParams): Promise<BudgetsTable[]> {
    const {
      userId,
      fiscalYear,
      description,
      estimatedTotalExpense,
      estimatedTotalIncome,
      icon = 'banknote',
      currency,
      isSystemGenerated = false,
    } = params;

    // checked whether fiscalYear was in the past or not
    const currentYear = new Date().getFullYear();
    if (fiscalYear < currentYear) {
      throw new Error(Messages.BUDGET_PAST_YEAR_NOT_ALLOWED);
    }

    const foundCurrency = await prisma.currencyExchange.findUnique({
      where: {
        name: currency,
      },
    });
    if (!foundCurrency) {
      throw new Error(Messages.CURRENCY_NOT_FOUND);
    }

    return await prisma.$transaction(async (prisma) => {
      const { yearStart, effectiveEndDate } = calculateTransactionRange(fiscalYear);

      const transactions = await this.budgetRepository.fetchTransactionsTx(
        userId,
        yearStart,
        effectiveEndDate,
        prisma,
      );

      const { totalExpenseAct, totalIncomeAct } = await this.calculateActualTotals(
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
        const restParams = {
          description,
          icon,
          currencyId: foundCurrency?.id,
          currency: foundCurrency?.name,
          isSystemGenerated,
        };

        const budget = await this.createSingleBudget(
          prisma,
          userId,
          fiscalYear,
          budgetTypeData,
          restParams,
          transactions,
        );

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
  async updateBudgetTransaction(params: BudgetUpdateParams): Promise<BudgetsTable[]> {
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

    if (type === 'Act') {
      throw new Error('Act budget is not allowed to be update manually');
    }

    const budgetTypeData: BudgetTypeData[] = [
      { type: 'Top', totalExpense: estimatedTotalExpense, totalIncome: estimatedTotalIncome },
      // { type: 'Act', totalExpense: totalExpenseAct, totalIncome: totalIncomeAct },
    ];

    const foundCurrency = await prisma.currencyExchange.findUnique({
      where: {
        name: currency,
      },
    });
    if (!foundCurrency) {
      throw new Error(Messages.CURRENCY_NOT_FOUND);
    }

    // update budget with currency
    const updatedBudgets = await Promise.all(
      budgetTypeData.map((budgetTypeData) =>
        this.updateSingleBudget(prisma, userId, fiscalYear, budgetId, budgetTypeData, {
          description,
          icon,
          currencyId: foundCurrency.id,
          currency: foundCurrency.name,
        }),
      ),
    );
    // return budget
    return updatedBudgets;
  }

  private async updateSingleBudget(
    prisma: Prisma.TransactionClient,
    userId: string,
    fiscalYear: number,
    budgetId: string,
    { type, totalExpense, totalIncome }: BudgetTypeData,
    { description, icon, currencyId, currency }: Partial<BudgetCreationParams>,
  ) {
    // Check if budget exists
    const existingBudget = await prisma.budgetsTable.findUnique({
      where: {
        id: budgetId,
        type: type as BudgetType,
        fiscalYear: fiscalYear.toString(),
      },
    });

    if (!existingBudget) {
      throw new Error(Messages.BUDGET_NOT_FOUND);
    }

    const { monthFields, quarterFields, halfYearFields } = calculateBudgetAllocation(
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
        currencyId,
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
  async createBudget(params: BudgetCreationParams) {
    const {
      userId,
      fiscalYear,
      description,
      estimatedTotalExpense,
      estimatedTotalIncome,
      icon,
      currency,
      currencyId,
      isSystemGenerated = false,
      type,
      transactions = [],
      transactionIds = [],
    } = params;

    return await prisma.$transaction(async (prisma) => {
      const totalExpense = estimatedTotalExpense;
      const totalIncome = estimatedTotalIncome;

      const { monthFields, quarterFields, halfYearFields } =
        type === BudgetType.Act
          ? await calculateSumUpAllocation(transactions || [], currency!)
          : calculateBudgetAllocation(totalExpense, totalIncome);

      const newBudget = await prisma.budgetsTable.upsert({
        where: {
          fiscalYear_type_userId: {
            userId,
            fiscalYear: fiscalYear.toString(),
            type: type as BudgetType,
          },
        },
        update: {
          total_exp: totalExpense,
          total_inc: totalIncome,
          ...halfYearFields,
          ...quarterFields,
          ...monthFields,
          currencyId,
          currency,
          updatedBy: !isSystemGenerated ? userId : undefined,
        },
        create: {
          userId,
          icon,
          fiscalYear: fiscalYear.toString(),
          type: type as BudgetType,
          total_inc: totalIncome,
          total_exp: totalExpense,
          ...halfYearFields,
          ...quarterFields,
          ...monthFields,
          createdBy: !isSystemGenerated ? userId : undefined,
          description,
          currencyId,
          currency,
        },
      });

      if (transactionIds.length > 0) {
        await prisma.transaction.updateMany({
          where: { id: { in: transactionIds } },
          data: { isMarked: true },
        });
      }

      return newBudget;
    });
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
        isMarked: false,
        isDeleted: false,
        type: { in: [TransactionType.Expense, TransactionType.Income] },
        ...additionalWhere,
      },
      {
        select: { id: true, date: true, type: true, amount: true, currency: true },
      },
    );
  }

  private buildWhereClauseGetAnnualBudgetByYears(
    filters: Filter,
    userId: string,
    search?: string,
    cursor?: number | null,
  ): Prisma.BudgetsTableWhereInput {
    let where = {
      userId,
    } as Prisma.BudgetsTableWhereInput;

    if (filters) {
      const whereClause = buildWhereClause(filters);
      where = { ...where, ...whereClause };
    }

    // Adjust the fiscalYear filter to allow past and future years
    where.fiscalYear = {
      ...(cursor && { lt: cursor.toString() }),
      ...(where.fiscalYear && typeof where.fiscalYear === 'object' ? where.fiscalYear : {}),
    };

    if (search) {
      if (search.length < 4 && /^\d+$/.test(search)) {
        // If user enters 4 digits, search for years ending with those digits (e.g., 19 => 1919, 2019, etc.)
        where.fiscalYear = {
          contains: search,
        };
      } else {
        where.fiscalYear = {
          equals: search,
        };
      }
    }

    return where;
  }

  async upsertBudget(currency: string, userId: string) {
    const currentYear = new Date().getFullYear();

    const defaultIcon = 'banknote';
    const defaultDescription = 'Auto-generated budget';

    let actEstimatedTotalExpense = 0;
    let actEstimatedTotalIncome = 0;

    // find default currency
    const foundDefaultCurrency = await prisma.currencyExchange.findFirst({
      where: {
        name: currency,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (!foundDefaultCurrency) {
      throw new Error('Default currency not found');
    }

    let budgetCopyCurrencyId = foundDefaultCurrency.id;
    let budgetCopyCurrency = foundDefaultCurrency.name;

    let budgetCopyDescription = defaultDescription;
    let budgetCopyIcon = defaultIcon;

    // Tìm năm nhỏ nhất có ngân sách hoặc giao dịch
    const foundMinBudgetYear = await this.budgetRepository.findBudgetData(
      { userId, type: BudgetType.Act },
      { select: { fiscalYear: true }, orderBy: { fiscalYear: 'asc' } },
    );

    const foundMinTransactionYear = await this.transactionRepository.findFirstTransaction(
      { userId, isDeleted: false, isMarked: false },
      { select: { date: true }, orderBy: { date: 'asc' } },
    );

    // Xác định năm nhỏ nhất có dữ liệu
    const minBudgetYearValue = foundMinBudgetYear ? Number(foundMinBudgetYear.fiscalYear) : null;
    const minTransactionYearValue = foundMinTransactionYear
      ? foundMinTransactionYear.date.getFullYear()
      : null;

    let minYear: number | null = null;

    // Đối chiếu để lấy dữ liệu gần nhất (Nếu có budget 2024 > transaction 2024 ....)
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

    let transactionsMerged: FetchTransactionResponse[] = [];
    let transactionsIdMerged: string[] = [];

    let skipCopyBudgetTransaction = false;

    while (!foundData && yearToCheck >= minYear) {
      // Kiểm tra ngân sách Act của năm hiện tại
      const latestCopyActBudget = await this.budgetRepository.findBudgetData({
        userId,
        type: BudgetType.Act,
        fiscalYear: yearToCheck.toString(),
      });

      if (latestCopyActBudget) {
        await this.budgetRepository.copyBudget({
          ...latestCopyActBudget,
          fiscalYear: currentYear.toString(),
        });

        budgetCopyCurrency = latestCopyActBudget.currency!;
        budgetCopyCurrencyId = latestCopyActBudget.currencyId!;
        budgetCopyDescription = latestCopyActBudget.description || defaultDescription;
        budgetCopyIcon = latestCopyActBudget.icon || defaultIcon;

        skipCopyBudgetTransaction = true;
        foundData = true;
      } else {
        const { yearStart, effectiveEndDate } = calculateTransactionRange(yearToCheck);

        const transactions = await this.fetchTransactions(userId, yearStart, effectiveEndDate);

        if (transactions.length > 0) {
          const { totalExpenseAct, totalIncomeAct } = await this.calculateActualTotals(
            transactions,
            budgetCopyCurrency,
          );

          actEstimatedTotalExpense = totalExpenseAct;
          actEstimatedTotalIncome = totalIncomeAct;

          // Đánh dấu giao dịch đã được tính
          const transactionIds = transactions.map((t) => t.id);
          if (transactionIds.length > 0) {
            transactionsMerged = [...transactionsMerged, ...transactions];
            transactionsIdMerged = [...transactionsIdMerged, ...transactionIds];
          }

          foundData = true;
        }
      }
      yearToCheck--; // Chuyển sang năm trước đó
    }

    // Tạo ngân sách Top và Bot với giá trị mặc định 0
    await this.createBudget({
      userId,
      fiscalYear: currentYear,
      estimatedTotalExpense: 0,
      estimatedTotalIncome: 0,
      description: defaultDescription,
      currencyId: budgetCopyCurrencyId,
      currency: budgetCopyCurrency,
      icon: defaultIcon,
      isSystemGenerated: true,
      type: BudgetType.Top,
    });

    await this.createBudget({
      userId,
      fiscalYear: currentYear,
      estimatedTotalExpense: 0,
      estimatedTotalIncome: 0,
      description: defaultDescription,
      currencyId: budgetCopyCurrencyId,
      currency: budgetCopyCurrency,
      icon: defaultIcon,
      isSystemGenerated: true,
      type: BudgetType.Bot,
    });

    if (!skipCopyBudgetTransaction) {
      // Cộng dồn giao dịch năm 2025 vào ngân sách Act
      const { yearStart, effectiveEndDate } = calculateTransactionRange(currentYear);

      const currentYearTransactions = await this.fetchTransactions(
        userId,
        yearStart,
        effectiveEndDate,
      );

      const { totalExpenseAct, totalIncomeAct } = await this.calculateActualTotals(
        currentYearTransactions,
        budgetCopyCurrency,
      );

      actEstimatedTotalExpense += totalExpenseAct;
      actEstimatedTotalIncome += totalIncomeAct;

      // Đánh dấu giao dịch năm 2025 đã được tính
      const currentYearTransactionIds = currentYearTransactions.map((t) => t.id);
      if (currentYearTransactionIds.length > 0) {
        transactionsIdMerged = [...transactionsIdMerged, ...currentYearTransactionIds];
        transactionsMerged = [...transactionsMerged, ...currentYearTransactions];
      }

      // Tạo ngân sách Act cho năm 2025
      await this.createBudget({
        userId,
        fiscalYear: currentYear,
        estimatedTotalExpense: actEstimatedTotalExpense,
        estimatedTotalIncome: actEstimatedTotalIncome,
        description: budgetCopyDescription,
        currencyId: budgetCopyCurrencyId,
        currency: budgetCopyCurrency,
        icon: budgetCopyIcon,
        isSystemGenerated: true,
        type: BudgetType.Act,
        transactions: transactionsMerged,
        transactionIds: transactionsIdMerged,
      });
    }
  }

  async calculateTentativeBudget(userId: string, currency: string) {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const tentativeTransactions = await this.transactionRepository.findManyTransactions(
      {
        userId,
        isDeleted: false,
        isMarked: false,
        date: {
          gte: startOfLastMonth, // Từ đầu tháng trước
        },
        type: { in: [TransactionType.Income, TransactionType.Expense] },
      },
      { select: { id: true, date: true, type: true, amount: true, currencyId: true } },
    );

    // Step 6: Process transactions to calculate tentative income/expense per year
    // Refactored to handle async currency conversion properly
    const tentativeTotalsByYear: Record<
      string,
      { currency: string; total_exp: number; total_inc: number }
    > = {};

    for (const transaction of tentativeTransactions) {
      const year = transaction.date.getFullYear();
      const key = `${year}-${transaction.currency}`;
      if (!tentativeTotalsByYear[key]) {
        tentativeTotalsByYear[key] = {
          currency: transaction.currency!,
          total_exp: 0,
          total_inc: 0,
        };
      }
      const convertedAmount = await convertCurrency(
        transaction.amount.toNumber(),
        transaction.currency!,
        currency,
      );
      if (transaction.type === TransactionType.Expense) {
        tentativeTotalsByYear[key].total_exp += convertedAmount;
      } else if (transaction.type === TransactionType.Income) {
        tentativeTotalsByYear[key].total_inc += convertedAmount;
      }
    }

    return tentativeTotalsByYear;
  }

  async getAnnualBudgetByYears(params: BudgetGetAnnualYearParams) {
    const { userId, cursor = null, take, currency, search, filters } = params;

    const currentYear = new Date().getFullYear();

    // Step 1.1: Check if budgets exist for the current year
    const currentYearBudgets = await this.budgetRepository.findBudgetData(
      { userId, fiscalYear: currentYear.toString() },
      { select: { fiscalYear: true, type: true } },
    );

    // Step 2.1: If no budgets for the current year, create them
    if (!currentYearBudgets) {
      // Find the least recent past year's budgets (if current year is 2025 => get 2024 )
      await this.upsertBudget(currency, userId);
    }

    const where = this.buildWhereClauseGetAnnualBudgetByYears(filters, userId, search, cursor);

    // Step 3: Fetch distinct years with budgets, sorted descending
    const distinctYears = await this.budgetRepository.findManyBudgetData(where, {
      select: { fiscalYear: true },
      distinct: ['fiscalYear'],
      orderBy: { fiscalYear: 'desc' },
      take,
    });

    const tentativeTotalsByYear = await this.calculateTentativeBudget(userId, currency);

    const years = distinctYears.map((d) => d.fiscalYear);

    // Step 4: Fetch budgets for the user
    const budgets = await this.budgetRepository.findManyBudgetData(where, {
      select: {
        id: true,
        icon: true,
        fiscalYear: true,
        total_inc: true,
        total_exp: true,
        currencyId: true,
        currency: true,
        createdAt: true,
        type: true,
      },
      orderBy: {
        fiscalYear: 'desc',
      },
    });

    // Step 5: Group budgets by year and extract Top, Bot, Act
    const budgetsByYear = budgets.reduce((acc: BudgetSummaryByYear, budget) => {
      if (!acc[budget.fiscalYear]) {
        acc[budget.fiscalYear] = {};
      }
      acc[budget.fiscalYear][budget.type] = {
        total_inc: budget.total_inc,
        total_exp: budget.total_exp,
        currency: budget.currency!,
        currencyId: budget.currencyId!,
        icon: budget.icon || '',
      };
      return acc;
    }, {});

    const foundDefaultCurrency = await prisma.currencyExchange.findFirst({
      where: {
        OR: [{ name: 'VND' }, { name: 'USD' }],
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    // Step 6: Prepare response data
    const response = await Promise.all(
      years.map(async (year) => {
        const budgetData = budgetsByYear[year] || {};

        const defaultBudgetData = {
          total_inc: 0,
          total_exp: 0,
          currencyId: foundDefaultCurrency?.id || '',
          currency: foundDefaultCurrency?.name || '',
          icon: budgetsByYear[year]?.icon || '',
        };

        const topData = budgetData[BudgetType.Top] || defaultBudgetData;
        const botData = budgetData[BudgetType.Bot] || defaultBudgetData;
        const actData = budgetData[BudgetType.Act] || defaultBudgetData;

        const tentativeKey = `${year}-${actData.currency}`;

        const tentativeTotals = tentativeTotalsByYear[tentativeKey] || {
          total_exp: 0,
          total_inc: 0,
          currency: actData.currency,
        };

        const [
          actIncomeConverted,
          actExpenseConverted,
          topIncomeConverted,
          topExpenseConverted,
          botIncomeConverted,
          botExpenseConverted,
        ] = await Promise.all([
          convertCurrency(
            typeof actData.total_inc === 'number'
              ? actData.total_inc
              : (actData.total_inc?.toNumber?.() ?? 0),
            actData.currency,
            currency,
          ),
          convertCurrency(
            typeof actData.total_exp === 'number'
              ? actData.total_exp
              : (actData.total_exp?.toNumber?.() ?? 0),
            actData.currency,
            currency,
          ),
          convertCurrency(
            typeof topData.total_inc === 'number'
              ? topData.total_inc
              : (topData.total_inc?.toNumber?.() ?? 0),
            topData.currency,
            currency,
          ),
          convertCurrency(
            typeof topData.total_exp === 'number'
              ? topData.total_exp
              : (topData.total_exp?.toNumber?.() ?? 0),
            topData.currency,
            currency,
          ),
          convertCurrency(
            typeof botData.total_inc === 'number'
              ? botData.total_inc
              : (botData.total_inc?.toNumber?.() ?? 0),
            botData.currency,
            currency,
          ),
          convertCurrency(
            typeof botData.total_exp === 'number'
              ? botData.total_exp
              : (botData.total_exp?.toNumber?.() ?? 0),
            botData.currency,
            currency,
          ),
        ]);

        const combinedActIncome = actIncomeConverted + tentativeTotals.total_inc;
        const combinedActExpense = actExpenseConverted + tentativeTotals.total_exp;

        return {
          icon: topData.icon,
          year,
          budgetTopIncome: topIncomeConverted,
          budgetTopExpense: topExpenseConverted,
          budgetBotIncome: botIncomeConverted,
          budgetBotExpense: botExpenseConverted,
          budgetActIncome: combinedActIncome,
          budgetActExpense: combinedActExpense,
        };
      }),
    );

    // Step 7: Include the next cursor in the response
    const nextCursor = response.length === take ? response[response.length - 1].year : null;

    return {
      data: response,
      nextCursor,
      currency: currency,
    } as const;
  }

  async getListOfAvailableBudget(userId: string) {
    const budgets = await this.budgetRepository.findManyBudgetData(
      {
        userId,
        type: BudgetType.Act,
      },
      {
        select: {
          fiscalYear: true,
        },
        orderBy: {
          fiscalYear: 'desc',
        },
      },
    );

    return _.flatMap(budgets, (b) => b.fiscalYear);
  }

  async updateActBudgetTotalYears(userId: string) {
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
          fiscalYear: fiscalYear.toString(),
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

      newTransactions.forEach(async (t) => {
        const amount = await convertCurrency(
          t.amount.toNumber(),
          t.currency!,
          existingBudget.currency!,
        );
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
            fiscalYear: fiscalYear.toString(),
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
          updatedBy: userId,
          currency: existingBudget.currency!,
        },
      );

      if (!updatedBudget) {
        throw new Error(Messages.BUDGET_UPDATE_FAILED);
      }
    }
  }

  async updateActBudgetTransaction(userId: string, currency: string): Promise<void> {
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
    currency: string,
    transactions: FetchTransactionResponse[],
  ): Promise<void> {
    const foundBudget = await prisma.budgetsTable.findUnique({
      where: {
        fiscalYear_type_userId: {
          userId,
          fiscalYear: fiscalYear.toString(),
          type: BudgetType.Act,
        },
      },
    });

    if (!foundBudget) {
      return;
    }

    const { monthFields, quarterFields, halfYearFields } = await calculateSumUpAllocation(
      transactions,
      currency,
      foundBudget,
    );

    const { totalExpenseAct, totalIncomeAct } = await this.calculateActualBudgetAccumulatedTotals(
      transactions,
      currency,
      foundBudget,
    );

    await prisma.budgetsTable.update({
      where: {
        fiscalYear_type_userId: { userId, fiscalYear: fiscalYear.toString(), type: BudgetType.Act },
      },
      data: {
        total_exp: totalExpenseAct,
        total_inc: totalIncomeAct,
        ...halfYearFields,
        ...quarterFields,
        ...monthFields,
        currency,
      },
    });

    // Đánh dấu giao dịch mới
    const newTransactionIds = transactions.map((t) => t.id);

    if (newTransactionIds.length > 0) {
      await prisma.transaction.updateMany({
        where: { id: { in: newTransactionIds } },
        data: { isMarked: true },
      });
    }
  }

  private async updateBudgetForYear(
    prisma: any,
    userId: string,
    fiscalYear: number,
    currency: string,
  ): Promise<void> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const isCurrentYear = fiscalYear === currentYear;
    const targetMonth = isCurrentYear ? currentMonth - 2 : 12;

    if (isCurrentYear && targetMonth < 1) {
      return; // Không cập nhật nếu là tháng 1 hoặc 2
    }

    const { yearStart, effectiveEndDate } = calculateTransactionRange(fiscalYear);
    const newTransactions = await this.budgetRepository.fetchTransactionsTx(
      userId,
      yearStart,
      effectiveEndDate,
      prisma,
    );

    if (!newTransactions || newTransactions.length === 0) {
      return; // Không có giao dịch nào để cập nhật
    }

    await this.updateBudget(prisma, userId, fiscalYear, currency, newTransactions);
  }

  async checkedDuplicated(userId: string, fiscalYear: number): Promise<boolean> {
    const foundBudget = await this.budgetRepository.findBudgetData({
      userId,
      fiscalYear: fiscalYear.toString(),
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
