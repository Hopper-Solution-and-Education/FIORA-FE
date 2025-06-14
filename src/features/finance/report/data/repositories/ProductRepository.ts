import { decorate, injectable } from 'inversify';
import { GetListProductRequest, GetListProductResponse } from '../../domain/entities';
import { IProductAPI } from '../api/productApi';
import { ProductMapper } from '../mapper/ProductMapper';

export interface IProductRepository {
  getListProduct(request: GetListProductRequest): Promise<GetListProductResponse>;
}

export class ProductRepository implements IProductRepository {
  private productAPI: IProductAPI;

  constructor(productAPI: IProductAPI) {
    this.productAPI = productAPI;
  }

  async getListProduct(request: GetListProductRequest): Promise<GetListProductResponse> {
    const requestAPI = ProductMapper.toGetListProductRequestDTO(request);
    const response = await this.productAPI.getListProducts(requestAPI);
    return ProductMapper.toGetListProductResponse(response);
  }
}

// Apply decorators programmatically
decorate(injectable(), ProductRepository);

// Create a factory function
export const createProductRepository = (productAPI: IProductAPI): IProductRepository => {
  return new ProductRepository(productAPI);
};
