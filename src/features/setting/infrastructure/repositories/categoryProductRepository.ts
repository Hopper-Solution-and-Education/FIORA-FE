import { CategoryProducts, Prisma } from '@prisma/client';
import prisma from '@/infrastructure/database/prisma';
import { ICategoryProductRepository } from '../../domain/repositories/categoryProductRepository.interface';

class CategoryProductRepository implements ICategoryProductRepository {
  async createCategoryProduct(
    data: Prisma.CategoryProductsUncheckedCreateInput,
  ): Promise<CategoryProducts> {
    return prisma.categoryProducts.create({
      data: {
        ...data,
      },
    });
  }

  async findUniqueCategoryProduct(
    where: Prisma.CategoryProductsWhereUniqueInput,
  ): Promise<CategoryProducts | null> {
    return prisma.categoryProducts.findUnique({
      where,
    });
  }

  async findManyCategoryProducts(
    where: Prisma.CategoryProductsWhereInput,
    options: Prisma.CategoryProductsFindManyArgs,
  ): Promise<CategoryProducts[]> {
    return prisma.categoryProducts.findMany({
      where,
      ...options,
    });
  }

  async aggregate(options: Prisma.CategoryProductsAggregateArgs): Promise<any> {
    return prisma.categoryProducts.aggregate(options);
  }

  async count(options: Prisma.CategoryProductsCountArgs): Promise<number> {
    return prisma.categoryProducts.count(options);
  }
}

// Export a single instance
export const categoryProductRepository = new CategoryProductRepository();
