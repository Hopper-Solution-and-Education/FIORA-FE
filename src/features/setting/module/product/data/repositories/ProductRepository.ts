import { decorate, injectable } from 'inversify';
import {
  ProductCreateResponse,
  ProductDeleteRequest,
  ProductDeleteResponse,
  ProductGetSingleResponse,
  ProductGetTransactionRequest,
  ProductGetTransactionResponse,
  ProductsGetResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
} from '../../domain/entities/Product';
import { ProductFormValues } from '../../presentation/schema/addProduct.schema';
import type { IProductAPI } from '../api/productApi';
import { ProductsGetRequestDTO } from '../dto/request/ProductsGetRequestDTO';
import { ProductMapper } from '../mapper/ProductMapper';

export interface IProductRepository {
  createProduct: (request: ProductFormValues) => Promise<ProductCreateResponse>;
  getProducts: (request: ProductsGetRequestDTO) => Promise<ProductsGetResponse>;
  getSingleProduct: (id: string) => Promise<ProductGetSingleResponse>;
  updateProduct: (request: ProductUpdateRequest) => Promise<ProductUpdateResponse>;
  deleteProduct: (request: ProductDeleteRequest) => Promise<ProductDeleteResponse>;
  getProductTransaction: (
    request: ProductGetTransactionRequest,
  ) => Promise<ProductGetTransactionResponse>;
}

export class ProductRepository implements IProductRepository {
  private productApi: IProductAPI;

  constructor(productApi: IProductAPI) {
    this.productApi = productApi;
  }

  async getSingleProduct(id: string) {
    const requestAPI = ProductMapper.toGetSingleProductAPIRequest(id);
    const response = await this.productApi.getProduct(requestAPI);
    return ProductMapper.toGetSingleProductResponse(response);
  }

  async deleteProduct(request: ProductDeleteRequest) {
    const requestAPI = ProductMapper.toDeleteProductAPIRequest(request);
    const response = await this.productApi.deleteProduct(requestAPI);
    return ProductMapper.toDeleteProductResponse(response);
  }

  async createProduct(request: ProductFormValues) {
    const requestAPI = ProductMapper.toCreateProductAPIRequest(request);
    return this.productApi.createProduct(requestAPI);
  }

  async updateProduct(request: ProductUpdateRequest) {
    const requestAPI = ProductMapper.toUpdateProductAPIRequest(request);
    const response = await this.productApi.updateProduct(requestAPI);
    return ProductMapper.toUpdateProductResponse(response);
  }

  async getProducts(request: ProductsGetRequestDTO) {
    const response = await this.productApi.getProducts(request);
    return ProductMapper.toGetProductResponse(response);
  }

  async getProductTransaction(request: ProductGetTransactionRequest) {
    const requestAPI = ProductMapper.toGetProductTransactionAPIRequest(request);
    const response = await this.productApi.getProductTransaction(requestAPI);
    return ProductMapper.toGetProductTransactionResponse(response);
  }
}

// Apply decorators programmatically
decorate(injectable(), ProductRepository);

// Create a factory function
export const createProductRepository = (productApi: IProductAPI): IProductRepository => {
  return new ProductRepository(productApi);
};
