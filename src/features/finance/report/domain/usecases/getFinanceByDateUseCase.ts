import { decorate, injectable } from 'inversify';
import { IFinanceRepository } from '../../data/repositories';
import { GetFinanceByDateRequest, GetFinanceByDateResponse } from '../entities';

export interface IGetFinanceByDateUseCase {
  execute(params: GetFinanceByDateRequest): Promise<GetFinanceByDateResponse>;
}

export class GetFinanceByDateUseCase implements IGetFinanceByDateUseCase {
  private financeRepository: IFinanceRepository;

  constructor(financeRepository: IFinanceRepository) {
    this.financeRepository = financeRepository;
  }

  execute(params: GetFinanceByDateRequest): Promise<GetFinanceByDateResponse> {
    return this.financeRepository.getFinanceByDate(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), GetFinanceByDateUseCase);

// Create a factory function
export const createGetFinanceByDateUseCase = (
  financeRepository: IFinanceRepository,
): IGetFinanceByDateUseCase => {
  return new GetFinanceByDateUseCase(financeRepository);
};
