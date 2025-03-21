import { inject, injectable } from 'inversify';

import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { TYPES } from '../../di/productDIContainer.type';
import { GetProductTransactionResponse } from '../entities/Product';

export interface IGetProductTransactionUseCase {
  execute(page: number, pageSize: number, userId: string): Promise<GetProductTransactionResponse>;
}

@injectable()
export class GetProductTransactionUseCase implements IGetProductTransactionUseCase {
  private productRepository: IProductRepository;

  constructor(@inject(TYPES.IProductRepository) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(page: number, pageSize: number, userId: string) {
    return this.productRepository.getProductTransaction({ page, pageSize, userId });
  }
}
