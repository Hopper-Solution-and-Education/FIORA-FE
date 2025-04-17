import { CategoryProducts, Prisma } from '@prisma/client';
import { prisma } from '@/config';
import { ICategoryProductRepository } from '../../application/repositories/categoryProductRepository.interface';

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
    where: Prisma.CategoryProductsWhereInput,
    options?: Prisma.CategoryProductsFindFirstArgs,
  ): Promise<CategoryProducts | null> {
    return prisma.categoryProducts.findFirst({
      where,
      ...options,
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

  async updateCategoryProduct(
    where: Prisma.CategoryProductsWhereUniqueInput,
    data: Prisma.CategoryProductsUpdateInput,
  ): Promise<CategoryProducts> {
    return prisma.categoryProducts.update({
      where,
      data,
    });
  }

  async updateManyCategoryProduct(
    where: Prisma.CategoryProductsWhereInput,
    data: Prisma.CategoryProductsUpdateManyMutationInput,
  ): Promise<Prisma.BatchPayload> {
    return prisma.categoryProducts.updateMany({
      where,
      data,
    });
  }

  async deleteCategoryProduct(
    where: Prisma.CategoryProductsWhereUniqueInput,
  ): Promise<CategoryProducts> {
    return prisma.categoryProducts.delete({
      where,
    });
  }
}

// Export a single instance
export const categoryProductRepository = new CategoryProductRepository();
