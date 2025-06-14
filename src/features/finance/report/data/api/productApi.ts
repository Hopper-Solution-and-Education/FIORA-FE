import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import { GetListProductsRequestDTO, GetListProductsResponseDTO } from '../dto';

export interface IProductAPI {
  getListProducts(request: GetListProductsRequestDTO): Promise<GetListProductsResponseDTO>;
}

class ProductAPI implements IProductAPI {
  async getListProducts(data: GetListProductsRequestDTO) {
    return await httpClient.get<GetListProductsResponseDTO>(
      `/api/products?page=${data.page}&pageSize=${data.pageSize}`,
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
