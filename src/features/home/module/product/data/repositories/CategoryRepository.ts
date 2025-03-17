import { inject, injectable } from 'inversify';
import type { ICategoryAPI } from '../api/categoryApi';
import { GetCategoryResponse } from '../../domain/entities/Category';
import { GetCategoryAPIRequest } from '../dto/request/GetCategoryAPIRequest';
import { TYPES } from '../../di/productDIContainer.type';

export interface ICategoryRepository {
  getListCategory: (sectionType: GetCategoryAPIRequest) => Promise<GetCategoryResponse>;
}

@injectable()
export class CategoryRepository implements ICategoryRepository {
  private categoryAPI: ICategoryAPI;

  constructor(@inject(TYPES.ICategoryAPI) sectionApi: ICategoryAPI) {
    this.categoryAPI = sectionApi;
  }

  async getListCategory(request: GetCategoryAPIRequest): Promise<GetCategoryResponse> {
    const response = await this.categoryAPI.fetchCategories(request);
    return response.data;
  }
}
