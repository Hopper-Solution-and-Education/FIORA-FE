import { decorate, injectable } from 'inversify';
import type { ICategoryRepository } from '../../data/repositories/CategoryRepository';
import { CategoryProductGetResponse } from '../entities/Category';

export interface IGetCategoryProductUseCase {
  execute(page: number, pageSize: number): Promise<CategoryProductGetResponse>;
}

export class GetCategoryProductUseCase implements IGetCategoryProductUseCase {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  execute(page: number, pageSize: number) {
    return this.categoryRepository.getListCategoryProduct({ page, pageSize });
  }
}

// Apply decorators programmatically
decorate(injectable(), GetCategoryProductUseCase);

// Create a factory function
export const createGetCategoryProductUseCase = (
  categoryRepository: ICategoryRepository,
): IGetCategoryProductUseCase => {
  return new GetCategoryProductUseCase(categoryRepository);
};
