import { decorate, injectable } from 'inversify';
import { ICategoryRepository } from '../../data/repositories/CategoryRepository';
import { CategoryProductCreateRequest, CategoryProductCreateResponse } from '../entities/Category';

export interface ICreateCategoryProductUseCase {
  execute(params: CategoryProductCreateRequest): Promise<CategoryProductCreateResponse>;
}

export class CreateCategoryProductUseCase implements ICreateCategoryProductUseCase {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  execute(params: CategoryProductCreateRequest): Promise<CategoryProductCreateResponse> {
    return this.categoryRepository.createCategoryProduct(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), CreateCategoryProductUseCase);

// Create a factory function
export const createCreateCategoryProductUseCase = (
  categoryRepository: ICategoryRepository,
): ICreateCategoryProductUseCase => {
  return new CreateCategoryProductUseCase(categoryRepository);
};
