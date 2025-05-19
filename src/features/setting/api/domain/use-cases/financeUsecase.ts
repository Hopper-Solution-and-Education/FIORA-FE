import { financeRepository } from '../../infrastructure/repositories/financeRepository';
import { IFinanceRepository } from '../../repositories/financeRepository.interface';

export class FinanceUseCase {
  constructor(private _financeRepository: IFinanceRepository = financeRepository) {}
}

export const financeUseCase = new FinanceUseCase();
