import { httpClient } from '@/config/HttpClient';
import { injectable } from 'inversify';
import { GetCategoryAPIRequestDTO } from '../dto/request/GetCategoryAPIRequestDTO';
import { GetCategoryAPIResponseDTO } from '../dto/response/GetCategoryAPIResponseDTO';

interface ICategoryAPI {
  fetchCategories(pagination: GetCategoryAPIRequestDTO): Promise<GetCategoryAPIResponseDTO>;
}

@injectable()
class CategoryAPI implements ICategoryAPI {
  async fetchCategories({
    page,
    pageSize,
  }: GetCategoryAPIRequestDTO): Promise<GetCategoryAPIResponseDTO> {
    return await httpClient.get(`/api/category-product?page=${page}&pageSize=${pageSize}`);
  }
}
export { CategoryAPI };
export type { ICategoryAPI };
