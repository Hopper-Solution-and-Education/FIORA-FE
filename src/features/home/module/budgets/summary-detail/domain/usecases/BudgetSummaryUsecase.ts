import { BudgetType } from '../entities/BudgetType';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import type { IBudgetSummaryRepository } from '../../data/repositories/IBudgetSummaryRepository';
import { IBudgetSummaryUseCase } from './IBudgetSummaryUseCase';
import { BudgetSummaryByType } from '../entities/BudgetSummaryByType';
import { BudgetSummaryResponseDTO } from '../../data/dto/response/BudgetSummaryResponseDTO';
@injectable()
export class BudgetSummaryUsecase implements IBudgetSummaryUseCase {
  constructor(
    @inject(TYPES.IBudgetSummaryRepository)
    private budgetSummaryRepository: IBudgetSummaryRepository,
  ) {}

  async getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponseDTO> {
    const budgets = await this.budgetSummaryRepository.getBudgetsByUserIdAndFiscalYear(
      userId,
      fiscalYear,
    );

    const topBudget = budgets.find((budget: any) => budget.type === BudgetType.Top) || null;
    const botBudget = budgets.find((budget: any) => budget.type === BudgetType.Bot) || null;
    const actBudget = budgets.find((budget: any) => budget.type === BudgetType.Act) || null;

    return {
      topBudget,
      botBudget,
      actBudget,
      allBudgets: budgets,
    };
  }

  async getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType> {
    const budget = await this.budgetSummaryRepository.getBudgetByType(fiscalYear, type);
    return budget;
  }
}
