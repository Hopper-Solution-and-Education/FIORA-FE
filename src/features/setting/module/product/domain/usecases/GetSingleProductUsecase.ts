import { decorate, injectable } from 'inversify';
import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { GetSingleProductResponse } from '../entities/Product';

export interface IGetSingleProductUseCase {
  execute(id: string): Promise<GetSingleProductResponse>;
}

export class GetSingleProductUseCase implements IGetSingleProductUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(id: string): Promise<GetSingleProductResponse> {
    return this.productRepository.getSingleProduct(id);
  }
}

// Apply decorators programmatically
decorate(injectable(), GetSingleProductUseCase);

// Create a factory function
export const createGetSingleProductUseCase = (
  productRepository: IProductRepository,
): IGetSingleProductUseCase => {
  return new GetSingleProductUseCase(productRepository);
};
