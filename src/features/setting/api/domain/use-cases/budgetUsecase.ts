import { IUserRepository } from '@/features/auth/domain/repositories/userRepository.interface';
import { IBudgetDetailRepository } from '../../repositories/budgetDetailRepository';
import { BudgetCreation, IBudgetRepository } from '../../repositories/budgetRepository';
import { budgetRepository } from '../../infrastructure/repositories/budgetProductRepository';
import { budgetDetailRepository } from '../../infrastructure/repositories/budgetDetailRepository';
import { userRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import _ from 'lodash';
import { BudgetDetailType, Prisma } from '@prisma/client';

class BudgetUseCase {
  private budgetRepository: IBudgetRepository;
  private budgetDetailRepository: IBudgetDetailRepository;
  private userRepository: IUserRepository;

  constructor(
    budgetRepository: IBudgetRepository,
    budgetDetailRepository: IBudgetDetailRepository,
    userRepository: IUserRepository,
  ) {
    this.budgetRepository = budgetRepository;
    this.budgetDetailRepository = budgetDetailRepository;
    this.userRepository = userRepository;
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
    } = params;

    const foundUser = await this.userRepository.findById(userId);
    if (!foundUser) {
      throw new Error('User not found');
    }

    const monthlyExpense = _.round(estimatedTotalExpense / 12, 2);
    const monthlyIncome = _.round(estimatedTotalIncome / 12, 2);

    // Create budget details for each month
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Monthly fields
    const monthFields = months.reduce<Record<string, number>>((acc, m) => {
      acc[`m${m}_exp`] = monthlyExpense;
      acc[`m${m}_inc`] = monthlyIncome;
      return acc;
    }, {});

    // Quarterly fields
    const quarters = {
      q1: [1, 2, 3],
      q2: [4, 5, 6],
      q3: [7, 8, 9],
      q4: [10, 11, 12],
    };

    const quarterFields = Object.entries(quarters).reduce<Record<string, number>>(
      (acc, [q, ms]) => {
        acc[`${q}_exp`] = _.round(ms.length * monthlyExpense, 2);
        acc[`${q}_inc`] = _.round(ms.length * monthlyIncome, 2);
        return acc;
      },
      {},
    );

    // Half year totals
    const h1_exp = _.round(monthlyExpense * 6, 2);
    const h2_exp = _.round(monthlyExpense * 6, 2);
    const h1_inc = _.round(monthlyIncome * 6, 2);
    const h2_inc = _.round(monthlyIncome * 6, 2);

    // ---------------------------
    // Step 1: Create Budget
    // ---------------------------
    const newBudget = await this.budgetRepository.createBudget({
      userId,
      fiscalYear,
      icon,
      total_exp: estimatedTotalExpense,
      total_inc: estimatedTotalIncome,
      h1_exp,
      h2_exp,
      h1_inc,
      h2_inc,
      ...quarterFields,
      ...monthFields,
      description,
      currency,
      createdBy: foundUser.id,
    });

    // ---------------------------
    // Step 2: Create BudgetDetails (24 rows)
    // ---------------------------
    const detailData = months.flatMap((month) => [
      {
        userId,
        budgetId: newBudget.id,
        type: BudgetDetailType.Expense,
        amount: monthlyExpense,
        month,
        createdBy: foundUser.id,
      },
      {
        userId,
        budgetId: newBudget.id,
        type: BudgetDetailType.Income,
        amount: monthlyIncome,
        month,
        createdBy: foundUser.id,
      },
    ]) as Prisma.BudgetDetailsCreateManyInput[];

    const budgetDetails = await this.budgetDetailRepository.createManyBudgetDetails(detailData);

    return {
      ...newBudget,
      budgetDetails,
    };
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
  userRepository,
);
