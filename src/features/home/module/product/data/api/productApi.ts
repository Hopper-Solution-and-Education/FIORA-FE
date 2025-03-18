// src/api/product.ts (hoặc nơi bạn định nghĩa ProductAPI)
import { httpClient } from '@/config/HttpClient';
import { injectable } from 'inversify';
import { CreateProductAPIRequest } from '../dto/request/CreateProductAPIRequest';
import { GetProductAPIRequest } from '../dto/request/GetProductAPIRequest';
import { CreateProductAPIResponse } from '../dto/response/CreateProductAPIResponse';
import { GetProductAPIResponse } from '../dto/response/GetProductAPIResponse';

interface IProductAPI {
  createProduct(data: CreateProductAPIRequest): Promise<CreateProductAPIResponse>;
  getProducts(data: GetProductAPIRequest): Promise<GetProductAPIResponse>;
}

@injectable()
class ProductAPI implements IProductAPI {
  async createProduct(data: CreateProductAPIRequest): Promise<CreateProductAPIResponse> {
    const response = await httpClient.post<CreateProductAPIResponse>('/api/products', data);
    return response;
  }

  async getProducts(data: GetProductAPIRequest): Promise<GetProductAPIResponse> {
    return await httpClient.get<GetProductAPIResponse>(
      `/api/products?page=${data.page}&pageSize=${data.pageSize}`,
    );
  }
}
export { ProductAPI };
export type { IProductAPI };
