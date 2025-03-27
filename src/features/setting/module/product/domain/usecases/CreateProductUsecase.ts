import { decorate, injectable } from 'inversify';
import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { ProductFormValues } from '../../presentation/schema/addProduct.schema';
import { CreateProductResponse } from '../entities/Product';

export interface ICreateProductUseCase {
  execute(params: ProductFormValues): Promise<CreateProductResponse>;
}

export class CreateProductUseCase implements ICreateProductUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(params: ProductFormValues): Promise<CreateProductResponse> {
    return this.productRepository.createProduct(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), CreateProductUseCase);

// Create a factory function
export const createCreateProductUseCase = (
  productRepository: IProductRepository,
): ICreateProductUseCase => {
  return new CreateProductUseCase(productRepository);
};
