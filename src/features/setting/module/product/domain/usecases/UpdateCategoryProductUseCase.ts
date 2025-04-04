import { decorate, injectable } from 'inversify';
import { ICategoryRepository } from '../../data/repositories/CategoryRepository';
import { CategoryProductUpdateRequest, CategoryProductUpdateResponse } from '../entities/Category';

export interface IUpdateCategoryProductUseCase {
  execute(params: CategoryProductUpdateRequest): Promise<CategoryProductUpdateResponse>;
}

export class UpdateCategoryProductUseCase implements IUpdateCategoryProductUseCase {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  execute(params: CategoryProductUpdateRequest): Promise<CategoryProductUpdateResponse> {
    return this.categoryRepository.updateCategoryProduct(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), UpdateCategoryProductUseCase);

// Create a factory function
export const createUpdateCategoryProductUseCase = (
  categoryRepository: ICategoryRepository,
): IUpdateCategoryProductUseCase => {
  return new UpdateCategoryProductUseCase(categoryRepository);
};
