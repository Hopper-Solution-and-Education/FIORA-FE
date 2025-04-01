import { decorate, injectable } from 'inversify';
import type { IProductRepository } from '../../data/repositories/ProductRepository';
import { GetProductTransactionResponse } from '../entities/Product';

export interface IGetProductTransactionUseCase {
  execute(page: number, pageSize: number, userId: string): Promise<GetProductTransactionResponse>;
}

export class GetProductTransactionUseCase implements IGetProductTransactionUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(page: number, pageSize: number, userId: string) {
    const response = await this.productRepository.getProductTransaction({ page, pageSize, userId });
    return this.transformResponse(response);
  }

  private transformResponse(
    response: GetProductTransactionResponse,
  ): GetProductTransactionResponse {
    const sortedData = response.data
      .sort((a, b) => {
        return new Date(b.category.createdAt).getTime() - new Date(a.category.createdAt).getTime();
      })
      .map((category) => {
        return {
          ...category,
          products: category.products.sort((a, b) => {
            return (
              new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime()
            );
          }),
        };
      });

    return {
      ...response,
      data: sortedData,
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
