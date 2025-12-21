import apiClient from '@/config/http-client';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { BaseResponse } from '@/shared/types';
import { routeConfig } from '@/shared/utils/route';
import { decorate, injectable } from 'inversify';
import {
  Product,
  ProductCreateResponse,
  ProductGetTransactionResponse,
  ProductsGetResponse,
} from '../../domain/entities';
import { ProductFormValues } from '../../presentation/schema';
import {
  ProductDeleteRequestDTO,
  ProductGetSingleRequestDTO,
  ProductGetTransactionRequestDTO,
  ProductsGetRequestDTO,
  ProductUpdateRequestDTO,
} from '../dto/request';
import {
  ProductCreateResponseDTO,
  ProductDeleteResponseDTO,
  ProductGetSingleResponseDTO,
  ProductUpdateResponseDTO,
} from '../dto/response';

interface IProductAPI {
  createProduct(data: ProductFormValues): Promise<ProductCreateResponseDTO>;
  updateProduct(data: ProductUpdateRequestDTO): Promise<ProductUpdateResponseDTO>;
  getProducts(data: ProductsGetRequestDTO): Promise<BaseResponse<ProductsGetResponse>>;
  getProduct(data: ProductGetSingleRequestDTO): Promise<ProductGetSingleResponseDTO>;
  deleteProduct(data: ProductDeleteRequestDTO): Promise<ProductDeleteResponseDTO>;
  getProductTransaction(
    data: ProductGetTransactionRequestDTO,
  ): Promise<BaseResponse<ProductGetTransactionResponse>>;
}

class ProductAPI implements IProductAPI {
  async createProduct(data: ProductFormValues) {
    const response = await apiClient.post<ProductCreateResponse>(ApiEndpointEnum.Products, data);
    return response;
  }

  async getProducts(data: ProductsGetRequestDTO) {
    return await apiClient.get<ProductsGetResponse>(
      routeConfig(ApiEndpointEnum.Products, {
        page: data.page || 1,
        pageSize: data.pageSize || 20,
      }),
    );
  }

  async updateProduct(data: ProductUpdateRequestDTO) {
    return await apiClient.put<Product>(
      routeConfig(ApiEndpointEnum.SingleProducts, { id: data.id }),
      data,
    );
  }

  async deleteProduct(data: ProductDeleteRequestDTO) {
    return await apiClient.delete<{ id: string }>(
      routeConfig(ApiEndpointEnum.SingleProducts, { id: data.id }),
      {
        targetId: data.targetId,
      },
    );
  }

  async getProductTransaction(data: ProductGetTransactionRequestDTO) {
    return await apiClient.post<ProductGetTransactionResponse>(
      ApiEndpointEnum.ProductsSearch,
      data,
    );
  }

  async getProduct(data: ProductGetSingleRequestDTO) {
    return await apiClient.get<Product>(
      routeConfig(ApiEndpointEnum.SingleProducts, { id: data.productId }),
    );
  }
}

// Apply decorators programmatically
decorate(injectable(), ProductAPI);

// Create a factory function
export const createProductAPI = (): IProductAPI => {
  return new ProductAPI();
};

export { ProductAPI };
export type { IProductAPI };
