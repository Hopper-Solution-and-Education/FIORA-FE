import { decorate, injectable } from 'inversify';
import { IFinanceRepository } from '../../data/repositories';
import { GetFinanceWithFilterRequest, GetFinanceWithFilterResponse } from '../entities';

export interface IGetFinanceWithFiltersUseCase {
  execute(params: GetFinanceWithFilterRequest): Promise<GetFinanceWithFilterResponse>;
}

export class GetFinanceWithFiltersUseCase implements IGetFinanceWithFiltersUseCase {
  private financeRepository: IFinanceRepository;

  constructor(financeRepository: IFinanceRepository) {
    this.financeRepository = financeRepository;
  }

  execute(params: GetFinanceWithFilterRequest): Promise<GetFinanceWithFilterResponse> {
    return this.financeRepository.getFinanceWithFilter(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), GetFinanceWithFiltersUseCase);

// Create a factory function
export const createGetFinanceWithFiltersUseCase = (
  financeRepository: IFinanceRepository,
): IGetFinanceWithFiltersUseCase => {
  return new GetFinanceWithFiltersUseCase(financeRepository);
};
