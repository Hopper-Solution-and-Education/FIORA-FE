import { decorate, injectable } from 'inversify';
import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { GetProductTransactionResponse } from '../entities/Product';

export interface IGetProductTransactionUseCase {
  execute(page: number, pageSize: number, userId: string): Promise<GetProductTransactionResponse>;
}

export class GetProductTransactionUseCase implements IGetProductTransactionUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(page: number, pageSize: number, userId: string) {
    return this.productRepository.getProductTransaction({ page, pageSize, userId });
  }
}

// Apply decorators programmatically
decorate(injectable(), GetProductTransactionUseCase);

// Create a factory function
export const createGetProductTransactionUseCase = (
  productRepository: IProductRepository,
): IGetProductTransactionUseCase => {
  return new GetProductTransactionUseCase(productRepository);
};
