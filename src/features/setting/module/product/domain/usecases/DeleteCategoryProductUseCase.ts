import { decorate, injectable } from 'inversify';
import { ICategoryRepository } from '../../data/repositories/CategoryRepository';
import { CategoryProductDeleteRequest, CategoryProductDeleteResponse } from '../entities/Category';

export interface IDeleteCategoryProductUseCase {
  execute(params: CategoryProductDeleteRequest): Promise<CategoryProductDeleteResponse>;
}

export class DeleteCategoryProductUseCase implements IDeleteCategoryProductUseCase {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  execute(params: CategoryProductDeleteRequest): Promise<CategoryProductDeleteResponse> {
    return this.categoryRepository.deleteCategoryProduct(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), DeleteCategoryProductUseCase);

// Create a factory function
export const createDeleteCategoryProductUseCase = (
  categoryRepository: ICategoryRepository,
): IDeleteCategoryProductUseCase => {
  return new DeleteCategoryProductUseCase(categoryRepository);
};
