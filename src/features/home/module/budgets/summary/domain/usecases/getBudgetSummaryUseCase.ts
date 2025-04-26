import { BudgetType } from '@prisma/client';
import { BudgetSummary, BudgetSummaryByType } from '../entities/BudgetSummary';
import budgetSummaryRepository, {
  IBudgetSummaryRepository,
} from '../../data/repositories/budgetSummaryRepository';

export interface IGetBudgetSummaryUseCase {
  execute(fiscalYear: number): Promise<BudgetSummary>;
  getByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType>;
}

export class GetBudgetSummaryUseCase implements IGetBudgetSummaryUseCase {
  private budgetSummaryRepository: IBudgetSummaryRepository;

  constructor(budgetSummaryRepository: IBudgetSummaryRepository) {
    this.budgetSummaryRepository = budgetSummaryRepository;
  }

  async execute(fiscalYear: number): Promise<BudgetSummary> {
    return this.budgetSummaryRepository.getBudgetSummary({ fiscalYear });
  }

  async getByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType> {
    return this.budgetSummaryRepository.getBudgetByType(fiscalYear, type);
  }
}

export default new GetBudgetSummaryUseCase(budgetSummaryRepository);
