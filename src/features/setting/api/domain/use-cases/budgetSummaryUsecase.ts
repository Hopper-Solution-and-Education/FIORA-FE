import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import { OPERAND } from '@/shared/types';
import {
  BudgetDetailCategoryCreationParams,
  BudgetDetailCategoryDeleteParams,
  MonthlyBudgetDetailValues,
} from '@/shared/types/budgetDetail.types';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { applyUpdates, MONTH_MAPPING } from '@/shared/utils/monthBudgetUtil';
import { BudgetDetails, BudgetDetailType, BudgetsTable, BudgetType, Currency, Prisma } from '@prisma/client';
import { ITransactionRepository } from '../../../../transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '../../../../transaction/infrastructure/repositories/transactionRepository';
import { budgetRepository } from '../../infrastructure/repositories/budgetProductRepository';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository';
import { IBudgetRepository } from '../../repositories/budgetRepository';
import { ICategoryRepository } from '../../repositories/categoryRepository.interface';
import { getBudgetStrategy } from '../../strategy/budgetStrategy';

interface BudgetSummaryResponse {
  topBudget: BudgetsTable | null;
  botBudget: BudgetsTable | null;
  actBudget: BudgetsTable | null;
  allBudgets: BudgetsTable[];
}

class BudgetSummaryUseCase {
  constructor(
    private _budgetRepository: IBudgetRepository = budgetRepository,
    private _transactionRepository: ITransactionRepository = transactionRepository,
    private _categoryRepository: ICategoryRepository = categoryRepository,
  ) { }

  async getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponse> {
    const budgets = await this._budgetRepository.findBudgetsByUserIdAndFiscalYear(
      userId,
      fiscalYear.toString(),
    );

    const topBudget = budgets.find((budget) => budget.type === BudgetType.Top) || null;
    const botBudget = budgets.find((budget) => budget.type === BudgetType.Bot) || null;
    const actBudget = budgets.find((budget) => budget.type === BudgetType.Act) || null;

    return {
      topBudget,
      botBudget,
      actBudget,
      allBudgets: budgets,
    };
  }

  async getBudgetByType(
    userId: string,
    fiscalYear: number,
    type: BudgetType,
  ): Promise<BudgetsTable | null> {
    const budgets = await this._budgetRepository.findBudgetsByUserIdAndFiscalYear(
      userId,
      fiscalYear.toString(),
    );
    const budget = budgets.find((budget) => budget.type === type) || null;

    if (budget && type === BudgetType.Act) {
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      const startOfFiscalYear = new Date(`${fiscalYear}-01-01`);
      const endOfFiscalYear = new Date(`${fiscalYear}-12-31`);

      const startDate = oneMonthAgo < startOfFiscalYear ? startOfFiscalYear : oneMonthAgo;
      const endDate = now > endOfFiscalYear ? endOfFiscalYear : now;

      const transactions = await this._transactionRepository.findManyTransactions({
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        isDeleted: false,
      });

      let totalIncome = 0;
      let totalExpense = 0;

      const monthlyIncome: Record<number, number> = {};
      const monthlyExpense: Record<number, number> = {};

      for (let i = 1; i <= 12; i++) {
        monthlyIncome[i] = 0;
        monthlyExpense[i] = 0;
      }

      transactions.forEach((transaction) => {
        const month = transaction.date.getMonth() + 1;

        if (transaction.type === 'Income') {
          totalIncome += Number(transaction.amount);
          monthlyIncome[month] += Number(transaction.amount);
        } else if (transaction.type === 'Expense') {
          totalExpense += Number(transaction.amount);
          monthlyExpense[month] += Number(transaction.amount);
        }
      });

      budget.total_inc = new Prisma.Decimal(totalIncome);
      budget.total_exp = new Prisma.Decimal(totalExpense);

      for (let i = 1; i <= 12; i++) {
        const incField = `m${i}_inc`;
        const expField = `m${i}_exp`;

        (budget as any)[incField] = new Prisma.Decimal(monthlyIncome[i]);
        (budget as any)[expField] = new Prisma.Decimal(monthlyExpense[i]);
      }

      budget.q1_inc = new Prisma.Decimal(monthlyIncome[1] + monthlyIncome[2] + monthlyIncome[3]);
      budget.q1_exp = new Prisma.Decimal(monthlyExpense[1] + monthlyExpense[2] + monthlyExpense[3]);
      budget.q2_inc = new Prisma.Decimal(monthlyIncome[4] + monthlyIncome[5] + monthlyIncome[6]);
      budget.q2_exp = new Prisma.Decimal(monthlyExpense[4] + monthlyExpense[5] + monthlyExpense[6]);
      budget.q3_inc = new Prisma.Decimal(monthlyIncome[7] + monthlyIncome[8] + monthlyIncome[9]);
      budget.q3_exp = new Prisma.Decimal(monthlyExpense[7] + monthlyExpense[8] + monthlyExpense[9]);
      budget.q4_inc = new Prisma.Decimal(monthlyIncome[10] + monthlyIncome[11] + monthlyIncome[12]);
      budget.q4_exp = new Prisma.Decimal(
        monthlyExpense[10] + monthlyExpense[11] + monthlyExpense[12],
      );

      const q1Inc = Number(budget.q1_inc);
      const q2Inc = Number(budget.q2_inc);
      const q3Inc = Number(budget.q3_inc);
      const q4Inc = Number(budget.q4_inc);
      const q1Exp = Number(budget.q1_exp);
      const q2Exp = Number(budget.q2_exp);
      const q3Exp = Number(budget.q3_exp);
      const q4Exp = Number(budget.q4_exp);

      budget.h1_inc = new Prisma.Decimal(q1Inc + q2Inc);
      budget.h1_exp = new Prisma.Decimal(q1Exp + q2Exp);
      budget.h2_inc = new Prisma.Decimal(q3Inc + q4Inc);
      budget.h2_exp = new Prisma.Decimal(q3Exp + q4Exp);
    }

    return budget;
  }

  private getMonthlyValues(
    budget: BudgetsTable,
    type: 'exp' | 'inc',
    fromCurrency: Currency,
    targetCurrency: Currency,
  ): number[] {
    return MONTH_MAPPING.months.map((m) => {
      const fieldValue =
        (budget[`${m}_${type}` as keyof BudgetsTable] as Prisma.Decimal | undefined) ??
        new Prisma.Decimal(0);
      const value = Number(fieldValue);

      return convertCurrency(value, fromCurrency, targetCurrency);
    });
  }

  async updateBudgetDetails(params: {
    userId: string;
    fiscalYear: string;
    type: BudgetDetailType;
    updateTopBudget: Record<string, number>;
    currency: Currency;
  }): Promise<BudgetsTable> {
    const { userId, fiscalYear, type, updateTopBudget, currency } = params;

    const suffix = type === BudgetDetailType.Expense ? '_exp' : '_inc';

    // Validate keys in bottomUpPlan (and actualSumUpPlan if provided)
    const invalidKeys = [...Object.keys(updateTopBudget)].filter(
      (k) => !/^m([1-9]|1[0-2])$/.test(k.replace(suffix, '')) || !k.endsWith(suffix),
    );

    if (invalidKeys.length) {
      throw new Error(
        `Invalid keys in budget plan: ${invalidKeys.join(', ').slice(0, 20)}..., invalid keys mapping with given type: ${type}`,
      );
    }
    const now = new Date();
    const isExpense = type === BudgetDetailType.Expense;

    // Select the appropriate strategy based on the type of budget
    const strategy = getBudgetStrategy(isExpense);
    const strategyType = strategy.getType() as 'exp' | 'inc';

    const affectedFieldsInitial = new Set<string>();

    return await prisma.$transaction(async (prisma) => {
      for (const key of Object.keys(updateTopBudget)) {
        if (key.startsWith('m')) {
          const monthIndex = parseInt(key.match(/\d+/)![0]) - 1;

          const quarter = Math.floor(monthIndex / 3) + 1;
          const half = monthIndex < 6 ? 1 : 2;

          affectedFieldsInitial.add(key);
          affectedFieldsInitial.add(`q${quarter}_${strategyType}`);
          affectedFieldsInitial.add(`h${half}_${strategyType}`);
        }
      }

      affectedFieldsInitial.add(`total_${strategyType}`);

      const selectFields: Prisma.BudgetsTableSelect = {
        id: true,
        currency: true,
        ...strategy.getFields(affectedFieldsInitial),
      };

      const existingBudget = await prisma.budgetsTable.findFirst({
        where: {
          userId,
          fiscalYear,
          type: BudgetType.Top,
        },
        select: selectFields,
      });

      if (!existingBudget) {
        throw new Error(Messages.BUDGET_NOT_FOUND);
      }

      const storedCurrency = existingBudget.currency as Currency;

      // Convert existing monthly values to targetCurrency
      let monthlyValues = this.getMonthlyValues(
        existingBudget,
        strategyType,
        storedCurrency,
        currency,
      );

      // Update the affected fields in the map
      const affectedFields = new Map<string, boolean>();
      monthlyValues = applyUpdates(
        monthlyValues,
        updateTopBudget,
        strategyType,
        affectedFields,
        currency,
        storedCurrency,
      );

      // Calculate the totals based on the updated monthly values
      const totals = strategy.calculateTotals(monthlyValues);
      const updateData = {
        ...strategy.prepareUpdateData(totals, monthlyValues, affectedFields),
        updatedBy: userId,
        updatedAt: now,
      };

      const updatedBudget = await prisma.budgetsTable.update({
        where: { id: existingBudget.id },
        data: updateData,
      });

      if (!updatedBudget) {
        throw new Error(Messages.BUDGET_UPDATE_FAILED);
      }

      return updatedBudget;
    });
  }

  async deleteBudgetDetailsCategory(params: BudgetDetailCategoryDeleteParams) {
    const { userId, categoryId, fiscalYear, type } = params;

    const suffix = type === BudgetDetailType.Expense ? '_exp' : '_inc';

    // Validate existence of categoryId
    const foundCategory = await this._categoryRepository.findCategoryById(categoryId);

    if (!foundCategory) {
      throw new Error(Messages.CATEGORY_NOT_FOUND);
    }

    return await prisma.$transaction(async (prisma) => {
      const extractBudgetTypesByYear = await prisma.budgetsTable.findFirst({
        where: {
          userId,
          fiscalYear: fiscalYear.toString(),
          type: BudgetType.Bot,
        },
      });

      if (!extractBudgetTypesByYear) {
        throw new Error(Messages.BUDGET_NOT_FOUND);
      }

      // Determine target currency from BudgetsTable
      const targetCurrency = extractBudgetTypesByYear.currency;

      // Fetch old budget details for this category to get old values
      const oldBudgetDetails = await prisma.budgetDetails.findMany({
        where: {
          userId,
          budgetId: extractBudgetTypesByYear.id,
          categoryId,
          type,
        },
        select: {
          month: true,
          amount: true,
          currency: true,
        },
      });

      // 2. Prepare data for subtraction (use old values as amounts to subtract)
      const amountsToSubtract = Array(12)
        .fill(0)
        .map((_, i) => {
          const oldDetail = oldBudgetDetails.find((d) => d.month === i + 1);
          const value = oldDetail
            ? convertCurrency(
              Number(oldDetail.amount),
              oldDetail.currency || targetCurrency,
              targetCurrency,
            )
            : 0;
          return { amount: new Prisma.Decimal(value), month: i + 1, currency: targetCurrency };
        });

      // Prepare update data by summing old and new values
      const updateData: Prisma.BudgetsTableUpdateInput = await this.sumOldNewBudgetUpdate(
        userId,
        extractBudgetTypesByYear,
        amountsToSubtract,
        suffix,
        OPERAND.SUBTRACT,
      );

      const updated = await prisma.budgetsTable.update({
        where: { id: extractBudgetTypesByYear.id },
        data: updateData,
      });

      if (!updated) {
        throw new Error(Messages.BUDGET_UPDATE_FAILED);
      }

      // Delete budget details for the Bot budget
      const deletedBudgetDetails = await prisma.budgetDetails.deleteMany({
        where: {
          userId,
          budgetId: extractBudgetTypesByYear.id,
          categoryId,
          type,
        },
      });

      if (deletedBudgetDetails.count === 0) {
        throw new Error(Messages.BUDGET_DETAIL_DELETE_FAILED);
      }

      return deletedBudgetDetails;
    });
  }

  async upsertBudgetCategoryDetailsByType(
    monthlyBudgetDetailValues: MonthlyBudgetDetailValues,
    userId: string,
    budgetId: string,
    categoryId: string,
    type: BudgetDetailType,
    currency: Currency,
    prisma: Prisma.TransactionClient,
  ): Promise<BudgetDetails[]> {
    const upsertPromises = monthlyBudgetDetailValues.map((v, index) => {
      const amount = type === BudgetDetailType.Act ? v.actual : v.bottomUp;

      const where: Prisma.BudgetDetailsWhereUniqueInput = {
        month_categoryId_type_budgetId_userId: {
          userId,
          budgetId,
          categoryId,
          month: index + 1,
          type,
        }
      }

      const createData: Prisma.BudgetDetailsUncheckedCreateInput = {
        userId,
        budgetId,
        categoryId,
        type,
        amount,
        month: index + 1,
        createdBy: userId,
        currency,
      }

      const updateData: Prisma.BudgetDetailsUpdateInput = {
        amount,
        updatedBy: userId,
        currency,
      }

      return this._budgetRepository.upsertBudgetDetailsProduct(
        where,
        updateData,
        createData,
        prisma,
      )
    });

    const updatedBudgetDetails = await Promise.all(upsertPromises);

    if (updatedBudgetDetails.length !== 12) {
      throw new Error('Failed to upsert all 12 months');
    }

    return updatedBudgetDetails;
  }

  async upsertBudgetCategoryDetailsCategory(params: BudgetDetailCategoryCreationParams) {
    const { userId, fiscalYear, categoryId, type, bottomUpPlan, actualSumUpPlan, currency } =
      params;

    // Validate existence of categoryId
    const foundCategory = await this._categoryRepository.findFirstCategory({
      id: categoryId,
      userId,
    });

    if (!foundCategory) {
      throw new Error(Messages.CATEGORY_NOT_FOUND);
    }

    if (foundCategory.type !== type) {
      throw new Error(Messages.CATEGORY_TYPE_MISMATCH);
    }

    const suffix = type === BudgetDetailType.Expense ? '_exp' : '_inc';

    // Validate keys in bottomUpPlan (and actualSumUpPlan if provided)
    const invalidKeys = [
      ...Object.keys(bottomUpPlan),
      ...(actualSumUpPlan ? Object.keys(actualSumUpPlan) : []),
    ].filter((k) => !/^m([1-9]|1[0-2])$/.test(k.replace(suffix, '')) || !k.endsWith(suffix));

    if (invalidKeys.length) {
      throw new Error(
        `Invalid keys in budget plan: ${invalidKeys.join(', ').slice(0, 20)}..., invalid keys mapping with given type: ${type}`,
      );
    }

    return await prisma.$transaction(async (prisma) => {
      const extractBudgetTypesByYear = await prisma.budgetsTable.findFirst({
        where: {
          userId,
          fiscalYear: fiscalYear.toString(),
          type: BudgetType.Bot,
        },
      });

      if (!extractBudgetTypesByYear) {
        throw new Error(Messages.BUDGET_NOT_FOUND);
      }

      // Determine target currency from BudgetsTable
      const targetCurrency = extractBudgetTypesByYear.currency;

      const monthlyBudgetDetailValues = Array(12)
        .fill(0)
        .map((_, i) => ({
          bottomUp: convertCurrency(
            Number(bottomUpPlan[`m${i + 1}${suffix}`]) || 0,
            currency,
            targetCurrency,
          ),
          actual: actualSumUpPlan
            ? convertCurrency(
              Number(actualSumUpPlan[`m${i + 1}${suffix}`]) || 0,
              currency,
              targetCurrency,
            )
            : 0,
        })) as MonthlyBudgetDetailValues;

      if (monthlyBudgetDetailValues.length !== 12)
        throw new Error('All 12 months must be provided');

      // 1. Fetch existing BudgetDetails to get old values
      const oldBudgetDetails = await prisma.budgetDetails.findMany({
        where: {
          userId,
          budgetId: extractBudgetTypesByYear.id,
          categoryId,
          type,
        },
        select: { month: true, amount: true, currency: true, },
      });

      // 2. Calculate deltas (new value - old value, 0 if no old value)
      const deltas = Array(12)
        .fill(0)
        .map((_, i) => {
          const oldDetail = oldBudgetDetails.find((d) => d.month === i + 1);

          const oldValue = oldDetail
            ? convertCurrency(
              Number(oldDetail.amount),
              oldDetail.currency || targetCurrency,
              targetCurrency,
            ) : 0;

          const newValue = monthlyBudgetDetailValues[i].bottomUp;
          const convertAmountDecimal = new Prisma.Decimal(newValue - oldValue)

          return {
            amount: convertAmountDecimal,
            month: i + 1,
            currency: targetCurrency,
          };
        });

      // 3. Upsert BudgetDetails for Expense/Income
      const updatedBudgetDetails = await this.upsertBudgetCategoryDetailsByType(
        monthlyBudgetDetailValues,
        userId,
        extractBudgetTypesByYear.id,
        categoryId,
        type,
        currency,
        prisma,
      );

      // 4. Optionally create Act entries if actualSumUpPlan is provided
      let actBudgetDetails: BudgetDetails[] = [];
      if (actualSumUpPlan) {
        actBudgetDetails = await this.upsertBudgetCategoryDetailsByType(
          monthlyBudgetDetailValues,
          userId,
          extractBudgetTypesByYear.id,
          categoryId,
          BudgetDetailType.Act,
          currency,
          prisma,
        )
      }

      // 5. Update BudgetsTable with deltas (or new values if creating)
      const updateData: Prisma.BudgetsTableUpdateInput = await this.sumOldNewBudgetUpdate(
        userId,
        extractBudgetTypesByYear,
        deltas,
        suffix,
      );

      const updated = await this._budgetRepository.updateBudgetTx(
        { id: extractBudgetTypesByYear.id },
        updateData,
        prisma,
      );

      if (!updated) {
        throw new Error(Messages.BUDGET_UPDATE_FAILED);
      }

      return [updatedBudgetDetails, actBudgetDetails.length ? actBudgetDetails : null, updated];
    });
  }

  private async sumOldNewBudgetUpdate(
    userId: string,
    extractBudgetTypesByYear: BudgetsTable,
    deltas: { amount: Prisma.Decimal; month: number; currency?: Currency }[],
    suffix: '_exp' | '_inc',
    operand?: OPERAND,
  ): Promise<Prisma.BudgetsTableUpdateInput> {
    const updateData: Prisma.BudgetsTableUpdateInput = {};

    const targetCurrency = extractBudgetTypesByYear.currency;

    // Map deltas to monthly values with currency conversion
    const monthlyDeltas = Array(12)
      .fill(0)
      .map((_, i) => {
        const delta = deltas.find((d) => d.month === i + 1);
        if (!delta) {
          throw new Error(`Missing delta for month ${i + 1}`);
        }
        const value = convertCurrency(
          Number(delta.amount),
          delta.currency || targetCurrency,
          targetCurrency,
        );
        return operand === OPERAND.SUBTRACT ? -value : value; // Negate for subtraction
      });

    // Calculate new totals
    const total = monthlyDeltas.reduce((sum, v) => sum + Number(v), 0);

    const quarterTotals = [0, 0, 0, 0].map((_, i) =>
      monthlyDeltas.slice(i * 3, i * 3 + 3).reduce((sum, v) => sum + Number(v), 0),
    );

    const halfYearTotals = [
      monthlyDeltas.slice(0, 6).reduce((sum, v) => sum + Number(v), 0),
      monthlyDeltas.slice(6).reduce((sum, v) => sum + Number(v), 0),
    ];

    // Helper to apply delta to existing value
    function applyDelta(field: string, deltaValue: number): Prisma.Decimal {
      const oldVal = Number(
        (extractBudgetTypesByYear as BudgetsTable)[field as keyof BudgetsTable] ?? 0,
      );
      const newVal = new Prisma.Decimal(oldVal).plus(deltaValue);
      // Ensure the result is not negative (optional, depending on business rules)
      return newVal.isNegative() ? new Prisma.Decimal(0) : newVal;
    }

    updateData[`total${suffix}`] = applyDelta(`total${suffix}`, total);

    for (let i = 0; i < 12; i++) {
      updateData[`m${i + 1}${suffix}` as keyof Prisma.BudgetsTableUpdateInput] = applyDelta(
        `m${i + 1}${suffix}`,
        monthlyDeltas[i],
      );
    }
    for (let i = 0; i < 4; i++) {
      updateData[`q${i + 1}${suffix}` as keyof Prisma.BudgetsTableUpdateInput] = applyDelta(
        `q${i + 1}${suffix}`,
        quarterTotals[i],
      );
    }
    for (let i = 0; i < 2; i++) {
      updateData[`h${i + 1}${suffix}` as keyof Prisma.BudgetsTableUpdateInput] = applyDelta(
        `h${i + 1}${suffix}`,
        halfYearTotals[i],
      );
    }

    updateData['updatedBy'] = userId;
    return updateData;
  }
}

export const budgetSummaryUseCase = new BudgetSummaryUseCase();
