import { decorate, injectable } from 'inversify';
import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { ProductUpdateRequest, ProductUpdateResponse } from '../entities/Product';

export interface IUpdateProductUseCase {
  execute(params: ProductUpdateRequest): Promise<ProductUpdateResponse>;
}

export class UpdateProductUseCase implements IUpdateProductUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(params: ProductUpdateRequest): Promise<ProductUpdateResponse> {
    return this.productRepository.updateProduct(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), UpdateProductUseCase);

// Create a factory function
export const createUpdateProductUseCase = (
  productRepository: IProductRepository,
): IUpdateProductUseCase => {
  return new UpdateProductUseCase(productRepository);
};
