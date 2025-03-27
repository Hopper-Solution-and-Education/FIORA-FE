import { decorate, injectable } from 'inversify';
import { GetCategoryResponse } from '../../domain/entities/Category';
import type { ICategoryAPI } from '../api/categoryApi';
import { GetCategoryAPIRequestDTO } from '../dto/request/GetCategoryAPIRequestDTO';

export interface ICategoryRepository {
  getListCategory: (sectionType: GetCategoryAPIRequestDTO) => Promise<GetCategoryResponse>;
}

export class CategoryRepository implements ICategoryRepository {
  private categoryAPI: ICategoryAPI;

  constructor(categoryAPI: ICategoryAPI) {
    this.categoryAPI = categoryAPI;
  }

  async getListCategory(request: GetCategoryAPIRequestDTO): Promise<GetCategoryResponse> {
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

// Apply decorators programmatically
decorate(injectable(), CategoryRepository);

// Create a factory function
export const createCategoryRepository = (categoryAPI: ICategoryAPI): ICategoryRepository => {
  return new CategoryRepository(categoryAPI);
};
