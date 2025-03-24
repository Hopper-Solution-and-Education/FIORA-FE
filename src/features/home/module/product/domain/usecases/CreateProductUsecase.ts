import { inject, injectable } from 'inversify';

import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { TYPES } from '../../di/productDIContainer.type';
import { ProductFormValues } from '../../presentation/schema/addProduct.schema';
import { CreateProductResponse } from '../entities/Product';

export interface ICreateProductUseCase {
  execute(params: ProductFormValues): Promise<CreateProductResponse>;
}

@injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  private productRepository: IProductRepository;

  constructor(@inject(TYPES.IProductRepository) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  execute(params: ProductFormValues): Promise<CreateProductResponse> {
    return this.productRepository.createProduct(params);
  }
}
