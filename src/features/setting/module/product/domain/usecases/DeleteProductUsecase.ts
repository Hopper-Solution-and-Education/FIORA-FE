import { decorate, injectable } from 'inversify';
import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { DeleteProductRequest, DeleteProductResponse } from '../entities/Product';

export interface IDeleteProductUseCase {
  execute(params: DeleteProductRequest): Promise<DeleteProductResponse>;
}

export class DeleteProductUseCase implements IDeleteProductUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(params: DeleteProductRequest): Promise<DeleteProductResponse> {
    return this.productRepository.deleteProduct(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), DeleteProductUseCase);

// Create a factory function
export const createDeleteProductUseCase = (
  productRepository: IProductRepository,
): IDeleteProductUseCase => {
  return new DeleteProductUseCase(productRepository);
};
