import { Prisma, ProductItems } from '@prisma/client';

export interface IProductItemsRepository {
    createProductItems(data: Prisma.ProductItemsUncheckedCreateInput): Promise<ProductItems>;
    findProductItemsById(
        where: Prisma.ProductItemsWhereInput,
        options?: Prisma.ProductItemsFindFirstArgs,
    ): Promise<ProductItems | null>;
    findManyProductItems(
        where: Prisma.ProductItemsWhereInput,
        options?: Prisma.ProductItemsFindManyArgs,
    ): Promise<ProductItems[]>;
    updateProductItems(
        where: Prisma.ProductItemsWhereUniqueInput,
        data: Prisma.ProductItemsUpdateInput,
    ): Promise<ProductItems>;
    deleteProductItems(where: Prisma.ProductItemsWhereUniqueInput): Promise<ProductItems>;
    aggregate(options: Prisma.ProductItemsAggregateArgs): Promise<any>;
    groupBy(options: Prisma.ProductItemsGroupByArgs): Promise<any>;
    count(options: Prisma.ProductItemsCountArgs): Promise<number>;
}