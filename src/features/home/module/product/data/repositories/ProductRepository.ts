import { decorate, injectable } from 'inversify';
import {
  CreateProductResponse,
  DeleteProductRequest,
  DeleteProductResponse,
  GetProductResponse,
  GetProductTransactionRequest,
  GetProductTransactionResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from '../../domain/entities/Product';
import { ProductFormValues } from '../../presentation/schema/addProduct.schema';
import type { IProductAPI } from '../api/productApi';
import { GetProductAPIRequestDTO } from '../dto/request/GetProductAPIRequestDTO';
import { ProductMapper } from '../mapper/ProductMapper';

export interface IProductRepository {
  createProduct: (request: ProductFormValues) => Promise<CreateProductResponse>;
  getProducts: (request: GetProductAPIRequestDTO) => Promise<GetProductResponse>;
  updateProduct: (request: UpdateProductRequest) => Promise<UpdateProductResponse>;
  deleteProduct: (request: DeleteProductRequest) => Promise<DeleteProductResponse>;
  getProductTransaction: (
    request: GetProductTransactionRequest,
  ) => Promise<GetProductTransactionResponse>;
}

export class ProductRepository implements IProductRepository {
  private productApi: IProductAPI;

  constructor(productApi: IProductAPI) {
    this.productApi = productApi;
  }

  async deleteProduct(request: DeleteProductRequest) {
    const requestAPI = ProductMapper.toDeleteProductAPIRequest(request);
    const response = await this.productApi.deleteProduct(requestAPI);
    return ProductMapper.toDeleteProductResponse(response);
  }

  async createProduct(request: ProductFormValues) {
    const requestAPI = ProductMapper.toCreateProductAPIRequest(request);
    return this.productApi.createProduct(requestAPI);
  }

  async updateProduct(request: UpdateProductRequest) {
    const requestAPI = ProductMapper.toUpdateProductAPIRequest(request);
    const response = await this.productApi.updateProduct(requestAPI);
    return ProductMapper.toUpdateProductResponse(response);
  }

  async getProducts(request: GetProductAPIRequestDTO) {
    const response = await this.productApi.getProducts(request);
    return ProductMapper.toGetProductResponse(response);
  }

  async getProductTransaction(request: GetProductTransactionRequest) {
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
