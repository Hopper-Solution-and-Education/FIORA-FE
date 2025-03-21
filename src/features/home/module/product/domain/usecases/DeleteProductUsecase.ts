import { inject, injectable } from 'inversify';

import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { TYPES } from '../../di/productDIContainer.type';
import { DeleteProductRequest, DeleteProductResponse } from '../entities/Product';

export interface IDeleteProductUseCase {
  execute(params: DeleteProductRequest): Promise<DeleteProductResponse>;
}

@injectable()
export class DeleteProductUseCase implements IDeleteProductUseCase {
  private productRepository: IProductRepository;

  constructor(@inject(TYPES.IProductRepository) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(params: DeleteProductRequest): Promise<DeleteProductResponse> {
    return this.productRepository.deleteProduct(params);
  }
}
