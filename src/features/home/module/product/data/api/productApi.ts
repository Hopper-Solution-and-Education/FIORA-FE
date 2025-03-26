// src/api/product.ts (hoặc nơi bạn định nghĩa ProductAPI)
import { httpClient } from '@/config/HttpClient';
import { decorate, injectable } from 'inversify';
import { CreateProductAPIRequestDTO } from '../dto/request/CreateProductAPIRequestDTO';
import { DeleteProductAPIRequestDTO } from '../dto/request/DeleteProductAPIRequestDTO';
import { GetProductAPIRequestDTO } from '../dto/request/GetProductAPIRequestDTO';
import { GetProductTransactionAPIRequestDTO } from '../dto/request/GetProductTransactionAPIRequestDTO';
import { UpdateProductAPIRequestDTO } from '../dto/request/UpdateProductAPIRequestDTO';
import { CreateProductAPIResponseDTO } from '../dto/response/CreateProductAPIResponseDTO';
import { DeleteProductAPIResponseDTO } from '../dto/response/DeleteProductAPIResponseDTO';
import { GetProductAPIResponseDTO } from '../dto/response/GetProductAPIResponseDTO';
import { getProductTransactionAPIResponseDTO } from '../dto/response/GetProductTransactionAPIResponseDTO';
import { UpdateProductAPIResponseDTO } from '../dto/response/UpdateProductAPIResponseDTO';

interface IProductAPI {
  createProduct(data: CreateProductAPIRequestDTO): Promise<CreateProductAPIResponseDTO>;
  updateProduct(data: UpdateProductAPIRequestDTO): Promise<UpdateProductAPIResponseDTO>;
  getProducts(data: GetProductAPIRequestDTO): Promise<GetProductAPIResponseDTO>;
  deleteProduct(data: DeleteProductAPIRequestDTO): Promise<DeleteProductAPIResponseDTO>;
  getProductTransaction(
    data: GetProductTransactionAPIRequestDTO,
  ): Promise<getProductTransactionAPIResponseDTO>;
}

class ProductAPI implements IProductAPI {
  async createProduct(data: CreateProductAPIRequestDTO) {
    const response = await httpClient.post<CreateProductAPIResponseDTO>('/api/products', data);
    return response;
  }

  async getProducts(data: GetProductAPIRequestDTO) {
    return await httpClient.get<GetProductAPIResponseDTO>(
      `/api/products?page=${data.page}&pageSize=${data.pageSize}`,
    );
  }

  async updateProduct(data: UpdateProductAPIRequestDTO) {
    return await httpClient.put<UpdateProductAPIResponseDTO>(`/api/products/${data.id}`, data);
  }

  async deleteProduct(data: DeleteProductAPIRequestDTO) {
    return await httpClient.delete<DeleteProductAPIResponseDTO>(`/api/products/${data.id}`);
  }

  async getProductTransaction(data: GetProductTransactionAPIRequestDTO) {
    return await httpClient.get<getProductTransactionAPIResponseDTO>(
      `/api/transactions/product?userId=${data.userId}&page=${data.page}&pageSize=${data.pageSize}`,
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
