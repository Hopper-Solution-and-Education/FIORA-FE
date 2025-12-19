import { FilterCriteria } from '@/shared/types';
import { decorate, injectable } from 'inversify';
import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { ProductGetTransactionResponse } from '../entities/Product';

export interface IGetProductTransactionUseCase {
  execute(
    page: number,
    pageSize: number,
    filters: FilterCriteria,
    userId: string,
    search?: string,
  ): Promise<ProductGetTransactionResponse>;
}

export class GetProductTransactionUseCase implements IGetProductTransactionUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(
    page: number,
    pageSize: number,
    filters: FilterCriteria,
    userId: string,
    search?: string,
  ) {
    const response = await this.productRepository.getProductTransaction({
      page,
      pageSize,
      filters,
      userId,
      search,
    });
    return this.transformResponse(response);
  }

  private transformResponse(
    response: ProductGetTransactionResponse,
  ): ProductGetTransactionResponse {
    const sortedData = response.items
      .sort((a, b) => {
        return new Date(b.category.createdAt).getTime() - new Date(a.category.createdAt).getTime();
      })
      .map((category) => {
        return {
          ...category,
          products: category.products.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }),
        };
      });

    return {
      ...response,
      items: sortedData,
    };
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
