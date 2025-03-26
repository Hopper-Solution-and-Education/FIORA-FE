import { httpClient } from '@/config/HttpClient';
import { decorate, injectable } from 'inversify';
import { GetCategoryAPIRequestDTO } from '../dto/request/GetCategoryAPIRequestDTO';
import { GetCategoryAPIResponseDTO } from '../dto/response/GetCategoryAPIResponseDTO';

interface ICategoryAPI {
  fetchCategories(pagination: GetCategoryAPIRequestDTO): Promise<GetCategoryAPIResponseDTO>;
}

class CategoryAPI implements ICategoryAPI {
  async fetchCategories({
    page,
    pageSize,
  }: GetCategoryAPIRequestDTO): Promise<GetCategoryAPIResponseDTO> {
    return await httpClient.get(`/api/category-product?page=${page}&pageSize=${pageSize}`);
  }
}

// Apply decorators programmatically
decorate(injectable(), CategoryAPI);

// Create a factory function
export const createCategoryAPI = (): ICategoryAPI => {
  return new CategoryAPI();
};

export { CategoryAPI };
export type { ICategoryAPI };
