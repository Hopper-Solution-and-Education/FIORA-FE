import { decorate, injectable } from 'inversify';
import type { ICategoryRepository } from '../../data/repositories/CategoryRepository';
import { GetCategoryResponse } from '../entities/Category';

export interface IGetCategoryUseCase {
  execute(page: number, pageSize: number): Promise<GetCategoryResponse>;
}

export class GetCategoryUseCase implements IGetCategoryUseCase {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  execute(page: number, pageSize: number) {
    return this.categoryRepository.getListCategory({ page, pageSize });
  }
}

// Apply decorators programmatically
decorate(injectable(), GetCategoryUseCase);

// Create a factory function
export const createGetCategoryUseCase = (
  categoryRepository: ICategoryRepository,
): IGetCategoryUseCase => {
  return new GetCategoryUseCase(categoryRepository);
};
