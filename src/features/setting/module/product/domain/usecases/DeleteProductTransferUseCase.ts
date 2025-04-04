import { decorate, injectable } from 'inversify';
import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { ProductTransferDeleteRequest, ProductTransferDeleteResponse } from '../entities/Product';

export interface IDeleteProductTransferUseCase {
  execute(params: ProductTransferDeleteRequest): Promise<ProductTransferDeleteResponse>;
}

export class DeleteProductTransferUseCase implements IDeleteProductTransferUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(params: ProductTransferDeleteRequest): Promise<ProductTransferDeleteResponse> {
    return this.productRepository.deleteProductTransfer(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), DeleteProductTransferUseCase);

// Create a factory function
export const createDeleteProductTransferUseCase = (
  productRepository: IProductRepository,
): IDeleteProductTransferUseCase => {
  return new DeleteProductTransferUseCase(productRepository);
};
