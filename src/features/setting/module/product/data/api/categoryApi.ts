import { httpClient } from '@/config/HttpClient';
import { decorate, injectable } from 'inversify';
import { CategoryProductCreateRequestDTO } from '../dto/request/CategoryProductCreateRequestDTO';
import { CategoryProductDeleteRequestDTO } from '../dto/request/CategoryProductDeleteRequestDTO';
import { CategoryProductGetRequestDTO } from '../dto/request/CategoryProductGetRequestDTO';
import { CategoryProductUpdateRequestDTO } from '../dto/request/CategoryProductUpdateRequestDTO';
import { CategoryProductCreateResponseDTO } from '../dto/response/CategoryProductCreateResponseDTO';
import { CategoryProductDeleteResponseDTO } from '../dto/response/CategoryProductDeleteResponseDTO';
import { CategoryProductGetResponseDTO } from '../dto/response/CategoryProductGetResponseDTO';
import { CategoryProductUpdateResponseDTO } from '../dto/response/CategoryProductUpdateResponseDTO';

interface ICategoryAPI {
  fetchCategories(pagination: CategoryProductGetRequestDTO): Promise<CategoryProductGetResponseDTO>;
  createCategory(
    request: CategoryProductCreateRequestDTO,
  ): Promise<CategoryProductCreateResponseDTO>;
  updateCategory(
    request: CategoryProductUpdateRequestDTO,
  ): Promise<CategoryProductUpdateResponseDTO>;
  deleteCategory(
    request: CategoryProductDeleteRequestDTO,
  ): Promise<CategoryProductDeleteResponseDTO>;
}

class CategoryAPI implements ICategoryAPI {
  async fetchCategories({
    page,
    pageSize,
  }: CategoryProductGetRequestDTO): Promise<CategoryProductGetResponseDTO> {
    return await httpClient.get(`/api/category-product?page=${page}&pageSize=${pageSize}`);
  }

  async createCategory(
    request: CategoryProductCreateRequestDTO,
  ): Promise<CategoryProductCreateResponseDTO> {
    return await httpClient.post(`/api/category-product`, request);
  }

  async updateCategory(
    request: CategoryProductUpdateRequestDTO,
  ): Promise<CategoryProductUpdateResponseDTO> {
    return await httpClient.put(`/api/category-product/${request.id}`, {
      name: request.name,
      description: request.description,
      icon: request.icon,
      tax_rate: request.tax_rate,
    });
  }

  async deleteCategory(
    request: CategoryProductDeleteRequestDTO,
  ): Promise<CategoryProductDeleteResponseDTO> {
    const response = await httpClient.delete<CategoryProductDeleteResponseDTO>(
      `/api/category-product/${request.productCategoryId}`,
    );
    return {
      ...response,
      data: { categoryProductId: request.productCategoryId, message: '' },
    };
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
