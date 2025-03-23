import { inject, injectable } from 'inversify';

import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { TYPES } from '../../di/productDIContainer.type';
import { UpdateProductRequest, UpdateProductResponse } from '../entities/Product';

export interface IUpdateProductUseCase {
  execute(params: UpdateProductRequest): Promise<UpdateProductResponse>;
}

@injectable()
export class UpdateProductUseCase implements IUpdateProductUseCase {
  private productRepository: IProductRepository;

  constructor(@inject(TYPES.IProductRepository) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(params: UpdateProductRequest): Promise<UpdateProductResponse> {
    return this.productRepository.updateProduct(params);
  }
}
