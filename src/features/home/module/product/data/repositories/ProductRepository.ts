import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/productDIContainer.type';
import { CreateProductResponse, GetProductResponse, Product } from '../../domain/entities/Product';
import { ProductFormValues } from '../../presentation/schema/addProduct.schema';
import type { IProductAPI } from '../api/productApi';
import { CreateProductAPIRequest } from '../dto/request/CreateProductAPIRequest';
import { GetProductAPIRequest } from '../dto/request/GetProductAPIRequest';

export interface IProductRepository {
  createProduct: (request: ProductFormValues) => Promise<CreateProductResponse>;
  getProducts: (request: GetProductAPIRequest) => Promise<GetProductResponse>;
}

@injectable()
export class ProductRepository implements IProductRepository {
  private productApi: IProductAPI;

  constructor(@inject(TYPES.IProductAPI) productApi: IProductAPI) {
    this.productApi = productApi;
  }

  async createProduct(request: ProductFormValues): Promise<CreateProductResponse> {
    const requestAPI: CreateProductAPIRequest = {
      icon: request.icon,
      name: request.name,
      description: request.description,
      tax_rate: request.taxRate,
      price: request.price,
      type: request.type,
      category_id: request.category_id,
      items: request.items,
    };

    return this.productApi.createProduct(requestAPI);
  }

  async getProducts(request: GetProductAPIRequest): Promise<GetProductResponse> {
    const response = await this.productApi.getProducts(request);
    const { data, page, pageSize, totalPage } = response.data;
    return {
      page,
      pageSize,
      totalPage,
      data: data.map((item) => {
        return new Product(item.name, item.description ?? '', item.icon, Number(item.taxRate));
      }),
    };
  }
}
