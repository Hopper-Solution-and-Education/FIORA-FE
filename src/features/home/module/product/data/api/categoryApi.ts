import { httpClient } from '@/config/HttpClient';
import { injectable } from 'inversify';
import { GetCategoryAPIRequest } from '../dto/request/GetCategoryAPIRequest';
import { GetCategoriesAPIResponse } from '../dto/response/GetCategoryAPIResponse';

interface ICategoryAPI {
  fetchCategories(pagination: GetCategoryAPIRequest): Promise<GetCategoriesAPIResponse>;
}

@injectable()
class CategoryAPI implements ICategoryAPI {
  async fetchCategories({
    page,
    pageSize,
  }: GetCategoryAPIRequest): Promise<GetCategoriesAPIResponse> {
    return await httpClient.get(`/api/products/category?page=${page}&limit=${pageSize}`);
  }
}
export { CategoryAPI };
export type { ICategoryAPI };
