import { ProductGetTransactionResponseDTO } from './../dto/response/ProductGetTransactionResponseDTO';
// src/api/product.ts (hoặc nơi bạn định nghĩa ProductAPI)
import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import {
  ProductCreateRequestDTO,
  ProductDeleteRequestDTO,
  ProductGetSingleRequestDTO,
  ProductGetTransactionRequestDTO,
  ProductsGetRequestDTO,
  ProductTransferDeleteRequestDTO,
  ProductUpdateRequestDTO,
} from '../dto/request';
import {
  ProductCreateResponseDTO,
  ProductDeleteResponseDTO,
  ProductGetSingleResponseDTO,
  ProductsGetResponseDTO,
  ProductTransferDeleteResponseDTO,
  ProductUpdateResponseDTO,
} from '../dto/response';

interface IProductAPI {
  createProduct(data: ProductCreateRequestDTO): Promise<ProductCreateResponseDTO>;
  updateProduct(data: ProductUpdateRequestDTO): Promise<ProductUpdateResponseDTO>;
  getProducts(data: ProductsGetRequestDTO): Promise<ProductsGetResponseDTO>;
  getProduct(data: ProductGetSingleRequestDTO): Promise<ProductGetSingleResponseDTO>;
  deleteProduct(data: ProductDeleteRequestDTO): Promise<ProductDeleteResponseDTO>;
  getProductTransaction(
    data: ProductGetTransactionRequestDTO,
  ): Promise<ProductGetTransactionResponseDTO>;
  deleteProductTransfer(
    data: ProductTransferDeleteRequestDTO,
  ): Promise<ProductTransferDeleteResponseDTO>;
}

class ProductAPI implements IProductAPI {
  async createProduct(data: ProductCreateRequestDTO) {
    const response = await httpClient.post<ProductCreateResponseDTO>('/api/products', data);
    return response;
  }

  async getProducts(data: ProductsGetRequestDTO) {
    return await httpClient.get<ProductsGetResponseDTO>(
      `/api/products?page=${data.page}&pageSize=${data.pageSize}`,
    );
  }

  async updateProduct(data: ProductUpdateRequestDTO) {
    return await httpClient.put<ProductUpdateResponseDTO>(`/api/products/${data.id}`, data);
  }

  async deleteProduct(data: ProductDeleteRequestDTO) {
    return await httpClient.delete<ProductDeleteResponseDTO>(`/api/products/${data.id}`);
  }

  async deleteProductTransfer(
    data: ProductTransferDeleteRequestDTO,
  ): Promise<ProductTransferDeleteResponseDTO> {
    const response = await httpClient.post<ProductTransferDeleteResponseDTO>(
      `/api/products/transfer`,
      data,
    );

    return {
      data: {
        id: data.sourceId,
      },
      message: response.message,
      status: response.status,
    };
  }

  async getProductTransaction(data: ProductGetTransactionRequestDTO) {
    return await httpClient.get<ProductGetTransactionResponseDTO>(
      `/api/transactions/product?userId=${data.userId}&page=${data.page}&pageSize=${data.pageSize}`,
    );
  }

  async getProduct(data: ProductGetSingleRequestDTO) {
    return await httpClient.get<ProductGetSingleResponseDTO>(`/api/products/${data.productId}`);
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
