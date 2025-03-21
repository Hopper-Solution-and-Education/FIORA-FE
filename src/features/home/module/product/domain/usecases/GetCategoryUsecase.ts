import { inject, injectable } from 'inversify';

import type { ICategoryRepository } from '../../data/repositories/CategoryRepository';
import { GetCategoryResponse } from '../entities/Category';
import { TYPES } from '../../di/productDIContainer.type';

export interface IGetCategoryUseCase {
  execute(page: number, pageSize: number): Promise<GetCategoryResponse>;
}

@injectable()
export class GetCategoryUseCase implements IGetCategoryUseCase {
  private categoryRepository: ICategoryRepository;

  constructor(@inject(TYPES.ICategoryRepository) categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  execute(page: number, pageSize: number) {
    return this.categoryRepository.getListCategory({ page, pageSize });
  }
}
