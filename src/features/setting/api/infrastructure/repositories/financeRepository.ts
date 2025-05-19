import { Category } from '@prisma/client';
import { IFinanceRepository } from '../../repositories/financeRepository.interface';

class FinanceRepository implements IFinanceRepository {
  async getCategory(userId: string, fiscalYear: string): Promise<Category[]> {
    throw new Error(`Method not implemented. ${userId} ${fiscalYear}`);
  }
}

export const financeRepository = new FinanceRepository();
