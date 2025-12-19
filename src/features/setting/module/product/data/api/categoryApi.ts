import apiClient from '@/config/http-client';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { decorate, injectable } from 'inversify';
import { CategoryProductGetResponse } from '../../domain/entities';
import {
  CategoryProductCreateRequestDTO,
  CategoryProductDeleteRequestDTO,
  CategoryProductGetRequestDTO,
  CategoryProductUpdateRequestDTO,
} from '../dto/request';
import {
  CategoryProductCreateResponseDTO,
  CategoryProductDeleteResponseDTO,
  CategoryProductGetResponseDTO,
  CategoryProductUpdateResponseDTO,
} from '../dto/response';

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
  async fetchCategories({ page, pageSize }: CategoryProductGetRequestDTO) {
    return await apiClient.get<CategoryProductGetResponse>(
      routeConfig(ApiEndpointEnum.ProductsCategory, {}, { page, pageSize }),
    );
  }

  async createCategory(
    request: CategoryProductCreateRequestDTO,
  ): Promise<CategoryProductCreateResponseDTO> {
    return await apiClient.post(ApiEndpointEnum.ProductsCategory, request);
  }

  async updateCategory(
    request: CategoryProductUpdateRequestDTO,
  ): Promise<CategoryProductUpdateResponseDTO> {
    return await apiClient.put(
      routeConfig(ApiEndpointEnum.SingleProductsCategory, { id: request.id }),
      {
        name: request.name,
        description: request.description,
        icon: request.icon,
        tax_rate: request.tax_rate,
      },
    );
  }

  async deleteCategory(
    request: CategoryProductDeleteRequestDTO,
  ): Promise<CategoryProductDeleteResponseDTO> {
    const response = await apiClient.delete(
      routeConfig(ApiEndpointEnum.SingleProductsCategory, { id: request.productCategoryId }),
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
