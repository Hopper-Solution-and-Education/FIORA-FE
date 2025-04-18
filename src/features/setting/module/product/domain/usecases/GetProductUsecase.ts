import { decorate, injectable } from 'inversify';
import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { Product, ProductsGetResponse } from '../entities/Product';

export interface IGetProductUseCase {
  execute(page: number, pageSize: number): Promise<ProductsGetResponse>;
}

export class GetProductUseCase implements IGetProductUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(page: number, pageSize: number): Promise<ProductsGetResponse> {
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
          item.catId,
          item.type,
          item.createdAt,
          item.updatedAt,
          [],
          item.currency,
        ),
    );

    // Return the response with mapped data
    return {
      ...response,
      data: mappedData,
    };
  }
}

// Apply decorators programmatically
decorate(injectable(), GetProductUseCase);

// Create a factory function
export const createGetProductUseCase = (
  productRepository: IProductRepository,
): IGetProductUseCase => {
  return new GetProductUseCase(productRepository);
};
