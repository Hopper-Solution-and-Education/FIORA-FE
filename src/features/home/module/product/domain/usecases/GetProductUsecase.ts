import { inject, injectable } from 'inversify';

import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { TYPES } from '../../di/productDIContainer.type';
import { GetProductResponse, Product } from '../entities/Product';

export interface IGetProductUseCase {
  execute(page: number, pageSize: number): Promise<GetProductResponse>;
}

@injectable()
export class GetProductUseCase implements IGetProductUseCase {
  private productRepository: IProductRepository;

  constructor(@inject(TYPES.IProductRepository) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(page: number, pageSize: number): Promise<GetProductResponse> {
    // Fetch products with sorting by createdAt (newest to oldest)
    const response = await this.productRepository.getProducts({
      page,
      pageSize,
    });

    // Map the response data to Product instances
    const mappedData = response.data.map(
      (item) =>
        new Product(
          item.id,
          item.name,
          item.description,
          item.icon,
          item.price,
          item.taxRate,
          item.items,
          item.categoryId,
          item.type,
          item.createdAt,
          item.updatedAt,
        ),
    );

    // Return the response with mapped data
    return {
      ...response,
      data: mappedData,
    };
  }
}
