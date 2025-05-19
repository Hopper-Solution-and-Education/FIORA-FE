import { Category } from '@prisma/client';

export interface IFinanceRepository {
  getCategory: (userId: string, fiscalYear: string) => Promise<Category[]>;
}
