// src/api/product.ts (hoặc nơi bạn định nghĩa ProductAPI)
import { httpClient } from '@/config/HttpClient';
import { injectable } from 'inversify';
import { CreateProductAPIRequestDTO } from '../dto/request/CreateProductAPIRequestDTO';
import { GetProductAPIRequestDTO } from '../dto/request/GetProductAPIRequestDTO';
import { UpdateProductAPIRequestDTO } from '../dto/request/UpdateProductAPIRequestDTO';
import { CreateProductAPIResponseDTO } from '../dto/response/CreateProductAPIResponseDTO';
import { GetProductAPIResponseDTO } from '../dto/response/GetProductAPIResponseDTO';
import { UpdateProductAPIResponseDTO } from '../dto/response/UpdateProductAPIResponseDTO';
import { DeleteProductAPIRequestDTO } from '../dto/request/DeleteProductAPIRequestDTO';
import { DeleteProductAPIResponseDTO } from '../dto/response/DeleteProductAPIResponseDTO';

interface IProductAPI {
  createProduct(data: CreateProductAPIRequestDTO): Promise<CreateProductAPIResponseDTO>;
  updateProduct(data: UpdateProductAPIRequestDTO): Promise<UpdateProductAPIResponseDTO>;
  getProducts(data: GetProductAPIRequestDTO): Promise<GetProductAPIResponseDTO>;
  deleteProduct(data: DeleteProductAPIRequestDTO): Promise<DeleteProductAPIResponseDTO>;
}

@injectable()
class ProductAPI implements IProductAPI {
  async createProduct(data: CreateProductAPIRequestDTO): Promise<CreateProductAPIResponseDTO> {
    const response = await httpClient.post<CreateProductAPIResponseDTO>('/api/products', data);
    return response;
  }

  async getProducts(data: GetProductAPIRequestDTO): Promise<GetProductAPIResponseDTO> {
    return await httpClient.get<GetProductAPIResponseDTO>(
      `/api/products?page=${data.page}&pageSize=${data.pageSize}`,
    );
  }

  async updateProduct(data: UpdateProductAPIRequestDTO): Promise<UpdateProductAPIResponseDTO> {
    return await httpClient.put<UpdateProductAPIResponseDTO>(`/api/products/${data.id}`, data);
  }

  async deleteProduct(data: DeleteProductAPIRequestDTO): Promise<DeleteProductAPIResponseDTO> {
    return await httpClient.delete<DeleteProductAPIResponseDTO>(`/api/products/${data.id}`);
  }
}
export { ProductAPI };
export type { IProductAPI };
