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

  async execute(page: number, pageSize: number) {
    const response = await this.categoryRepository.getListCategoryProduct({ page, pageSize });
    return this.processResponse(response);
  }

  private processResponse(response: CategoryProductGetResponse): CategoryProductGetResponse {
    const sortedData = response.items.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return {
      ...response,
      items: sortedData,
    };
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
