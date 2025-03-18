import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/productDIContainer.type';
import { GetCategoryResponse } from '../../domain/entities/Category';
import type { ICategoryAPI } from '../api/categoryApi';
import { GetCategoryAPIRequest } from '../dto/request/GetCategoryAPIRequest';

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
    return {
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalPage: response.data.totalPage,
      data: response.data.data.map((item) => {
        return {
          id: item.id,
          userId: item.userId,
          icon: item.icon,
          name: item.name,
          description: item.description,
          taxRate: Number(item.tax_rate),
        };
      }),
    };
  }
}
