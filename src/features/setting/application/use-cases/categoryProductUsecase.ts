import { PaginationResponse } from '@/shared/types/Common.types';
import {
  CategoryProductCreation,
  ICategoryProductRepository,
} from '../../domain/repositories/categoryProductRepository.interface';
import { categoryProductRepository } from '../../infrastructure/repositories/categoryProductRepository';
import { CategoryProducts, Prisma } from '@prisma/client';

class CategoryProductsUseCase {
  private categoryProductRepository: ICategoryProductRepository;

  constructor(categoryProductRepository: ICategoryProductRepository) {
    this.categoryProductRepository = categoryProductRepository;
  }

  async getAllCategoryProducts(params: {
    userId: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<CategoryProducts>> {
    try {
      const { userId, page = 1, pageSize = 20 } = params;

      const categoryProductsAwaited = this.categoryProductRepository.findManyCategoryProducts(
        { userId },
        { skip: (page - 1) * pageSize, take: pageSize },
      );

      const countAwaited = this.categoryProductRepository.count({
        where: {
          userId,
        },
      });

      const [categoryProducts = [], count] = await Promise.all([
        categoryProductsAwaited,
        countAwaited,
      ]);

      const totalPage = Math.ceil(count / pageSize);

      return {
        data: categoryProducts,
        page,
        pageSize,
        totalPage,
      };
    } catch (error: any) {
      throw new Error('Failed to get all category products ', error.message);
    }
  }

  async createCategoryProduct(data: CategoryProductCreation): Promise<CategoryProducts> {
    try {
      return this.categoryProductRepository.createCategoryProduct({
        ...data,
        ...(data.tax_rate ? { tax_rate: new Prisma.Decimal(data.tax_rate) } : { tax_rate: 0 }), // Default tax rate to 0 if not provided
      });
    } catch (error: any) {
      throw new Error('Failed to create category product ', error.message);
    }
  }
}

// Export a single instance using the exported productRepository
export const categoryProductsUseCase = new CategoryProductsUseCase(categoryProductRepository);
