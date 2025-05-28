import { decorate, injectable } from 'inversify';
import { IProductRepository } from '../../data/repositories/ProductRepository';
import { GetListProductRequest, GetListProductResponse } from '../entities';

export interface IGetAllProductUseCase {
  execute(params: GetListProductRequest): Promise<GetListProductResponse>;
}

export class getAllProductsUseCase implements IGetAllProductUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(params: GetListProductRequest): Promise<GetListProductResponse> {
    return this.productRepository.getListProduct(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), getAllProductsUseCase);

// Create a factory function
export const createGetAllProductsUseCase = (
  productRepository: IProductRepository,
): IGetAllProductUseCase => {
  return new getAllProductsUseCase(productRepository);
};
