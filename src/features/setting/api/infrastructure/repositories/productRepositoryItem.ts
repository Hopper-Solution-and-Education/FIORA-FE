import { prisma } from '@/config';
import { Prisma, Product, ProductItems } from '@prisma/client';
import { IProductItemsRepository } from '../../repositories/productItemRepository.interface';

class ProductItemsRepository implements IProductItemsRepository {
  async createProductItems(data: Prisma.ProductItemsUncheckedCreateInput): Promise<ProductItems> {
    return prisma.productItems.create({ data });
  }

  async findProductItemsById(
    where: Prisma.ProductItemsWhereInput,
    options?: Prisma.ProductItemsFindFirstArgs,
  ): Promise<ProductItems | null> {
    return prisma.productItems.findFirst({ where, ...options });
  }

  async findManyProductItems(
    where: Prisma.ProductItemsWhereInput,
    options?: Prisma.ProductItemsFindManyArgs,
  ): Promise<ProductItems[]> {
    return prisma.productItems.findMany({ where, ...options });
  }

  async updateProductItems(
    where: Prisma.ProductItemsWhereUniqueInput,
    data: Prisma.ProductItemsUpdateInput,
  ): Promise<ProductItems> {
    return prisma.productItems.update({ where, data });
  }

  async deleteProductItems(where: Prisma.ProductItemsWhereUniqueInput): Promise<ProductItems> {
    return prisma.productItems.delete({ where });
  }

  async aggregate(options: Prisma.ProductItemsAggregateArgs): Promise<any> {
    return prisma.productItems.aggregate(options);
  }

  async count(options: Prisma.ProductItemsCountArgs): Promise<number> {
    return prisma.productItems.count(options);
  }

  async groupBy(options: Prisma.ProductItemsGroupByArgs): Promise<any> {
    return prisma.productItems.groupBy({ ...options, orderBy: options.orderBy || {} });
  }
}

export const productItemsRepository = new ProductItemsRepository();
