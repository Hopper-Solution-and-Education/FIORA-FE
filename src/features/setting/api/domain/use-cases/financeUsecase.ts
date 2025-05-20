import { IAccountRepository } from '@/features/auth/domain/repositories/accountRepository.interface';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository';
import { ICategoryRepository } from '../../repositories/categoryRepository.interface';
import { accountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { IProductRepository } from '../../repositories/productRepository.interface';
import { productRepository } from '../../infrastructure/repositories/productRepository';

export class FinanceUseCase {
  constructor(
    private _categoryRepository: ICategoryRepository = categoryRepository,
    private _accountRepository: IAccountRepository = accountRepository,
    private _productRepository: IProductRepository = productRepository,
  ) {}
}

export const financeUseCase = new FinanceUseCase();
