import { BudgetsTable, BudgetType } from '@prisma/client';
import { IBudgetRepository } from '../../repositories/budgetRepository';
import { budgetRepository } from '../../infrastructure/repositories/budgetProductRepository';

interface BudgetSummaryResponse {
  topBudget: BudgetsTable | null;
  botBudget: BudgetsTable | null;
  actBudget: BudgetsTable | null;
  allBudgets: BudgetsTable[];
}

class BudgetSummaryUsecase {
  constructor(private _budgetRepository: IBudgetRepository = budgetRepository) {}

  async getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponse> {
    const budgets = await this._budgetRepository.findBudgetsByUserIdAndFiscalYear(
      userId,
      fiscalYear,
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
      fiscalYear,
    );
    return budgets.find((budget) => budget.type === type) || null;
  }
}

export const budgetSummaryUsecase = new BudgetSummaryUsecase();
