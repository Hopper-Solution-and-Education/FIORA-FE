import { inject, injectable } from 'inversify';

import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { TYPES } from '../../di/productDIContainer.type';
import { GetProductResponse } from '../entities/Product';

export interface IGetProductUseCase {
  execute(page: number, pageSize: number): Promise<GetProductResponse>;
}

@injectable()
export class GetProductUseCase implements IGetProductUseCase {
  private productRepository: IProductRepository;

  constructor(@inject(TYPES.IProductRepository) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(page: number, pageSize: number) {
    return this.productRepository.getProducts({ page, pageSize });
  }
}
