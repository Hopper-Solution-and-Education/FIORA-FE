import { decorate, injectable } from 'inversify';
import { IFinanceRepository } from '../../data/repositories';
import { GetFinanceByCategoryRequest, GetFinanceByCategoryResponse } from '../entities';

export interface IGetFinanceByCategoryUseCase {
  execute(params: GetFinanceByCategoryRequest): Promise<GetFinanceByCategoryResponse>;
}

export class GetFinanceByCategoryUseCase implements IGetFinanceByCategoryUseCase {
  private financeRepository: IFinanceRepository;

  constructor(financeRepository: IFinanceRepository) {
    this.financeRepository = financeRepository;
  }

  execute(params: GetFinanceByCategoryRequest): Promise<GetFinanceByCategoryResponse> {
    return this.financeRepository.getFinanceByCategory(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), GetFinanceByCategoryUseCase);

// Create a factory function
export const createGetFinanceByCategoryUseCase = (
  financeRepository: IFinanceRepository,
): IGetFinanceByCategoryUseCase => {
  return new GetFinanceByCategoryUseCase(financeRepository);
};
