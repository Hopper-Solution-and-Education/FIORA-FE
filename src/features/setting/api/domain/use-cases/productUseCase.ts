import { Messages } from '@/shared/constants/message';

import { prisma } from '@/config';
import { InternalServerError } from '@/shared/lib';
import { PaginationResponse, ProductItem } from '@/shared/types';
import { convertCurrency } from '@/shared/utils/exchangeRate';
import { Currency, Product, ProductType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { categoryProductRepository } from '../../infrastructure/repositories/categoryProductRepository';
import { productRepository } from '../../infrastructure/repositories/productRepository';
import { ICategoryProductRepository } from '../../repositories/categoryProductRepository.interface';
import {
  IProductRepository,
  ProductCreation,
  ProductUpdate,
} from '../../repositories/productRepository.interface';

class ProductUseCase {
  private productRepository: IProductRepository;
  private categoryProductRepository: ICategoryProductRepository;

  constructor(
    productRepository: IProductRepository,
    categoryProductRepository: ICategoryProductRepository,
  ) {
    this.productRepository = productRepository;
    this.categoryProductRepository = categoryProductRepository;
  }

  async getAllProducts(params: { userId: string }): Promise<Product[]> {
    const { userId } = params;
    try {
      const products = await this.productRepository.findManyProducts({
        userId,
      });

      return products;
    } catch (error: any) {
      throw new Error('Failed to get all products ', error.message);
    }
  }

  async getAllProductsPagination(params: {
    userId: string;
    page?: number;
    pageSize?: number;
    currency?: Currency;
  }): Promise<PaginationResponse<Product>> {
    try {
      const { userId, page = 1, pageSize = 20, currency = 'VND' } = params;
      const productsAwaited = this.productRepository.findManyProducts(
        { userId },
        { skip: (page - 1) * pageSize, take: pageSize },
      );

      const countAwaited = this.productRepository.count({
        where: {
          userId,
        },
      });

      const [products = [], count] = await Promise.all([productsAwaited, countAwaited]);

      const totalPage = Math.ceil(count / pageSize);

      // Transform the product price to the user's target currency if needed
      const transformedProductsAwaited = products.map(async (product) => {
        const transformedPrice =
          (await convertCurrency(product.price, product.currency, currency)) ||
          product.price.toNumber();

        return {
          ...product,
          price: transformedPrice,
          currency: currency,
        };
      });

      const transformedProducts = await Promise.all(transformedProductsAwaited);

      return {
        data: transformedProducts,
        page,
        pageSize,
        totalPage,
      };
    } catch (error: any) {
      throw new Error('Failed to get all products ', error.message);
    }
  }

  async getProductsByType(userId: string, type: ProductType): Promise<Product[]> {
    try {
      const products = await this.productRepository.groupBy({
        by: ['type'],
        where: {
          AND: {
            userId,
            type,
          },
        },
      });

      return products;
    } catch (error: any) {
      throw new Error('Failed to get products by type', error.message);
    }
  }

  async getProductById(params: { userId: string; id: string }) {
    const { userId, id } = params;
    try {
      const product = await this.productRepository.findProductById(
        {
          id,
          userId,
        },
        {
          include: {
            productItems: {
              select: {
                id: true,
                icon: true,
                name: true,
                description: true,
              },
            },
            transactions: true,
          },
        },
      );

      if (!product) {
        throw new Error(Messages.PRODUCT_NOT_FOUND);
      }

      return product;
    } catch (error: any) {
      throw new Error(error.message || Messages.GET_PRODUCT_FAILED);
    }
  }

  async createProduct(params: ProductCreation) {
    try {
      const {
        userId,
        icon,
        name,
        description = '',
        tax_rate = 0,
        price,
        type,
        category_id,
        items,
        currency = Currency.VND,
      } = params;

      const category = await this.categoryProductRepository.findUniqueCategoryProduct({
        id: category_id,
        userId,
      });

      if (!category) {
        throw new Error(Messages.CATEGORY_PRODUCT_NOT_FOUND);
      }

      const result = await prisma.$transaction(async (tx) => {
        // Create the product
        const product = await tx.product.create({
          data: {
            userId,
            icon,
            name,
            taxRate: tax_rate ?? params.tax_rate,
            price: new Decimal(price),
            type,
            catId: category_id,
            createdBy: userId,
            currency: currency,
            ...(description && { description }),
          },
          include: {
            productItems: true,
          },
        });

        if (items && Array.isArray(items)) {
          const itemsRes = await tx.productItems.createManyAndReturn({
            data: items.map((item) => ({
              icon: item.icon,
              name: item.name,
              description: item.description,
              userId,
              productId: product.id,
            })),
          });

          if (!itemsRes) {
            throw new Error(Messages.CREATE_PRODUCT_ITEM_FAILED);
          }

          product['productItems'] = itemsRes as unknown as ProductItem[];
        }

        return product;
      });

      return result;
    } catch (error: any) {
      throw new Error(error.message || Messages.CREATE_PRODUCT_FAILED);
    }
  }

  async updateProduct(params: ProductUpdate & { id: string }) {
    const {
      id,
      userId,
      icon,
      name,
      description = '',
      tax_rate = 0,
      price,
      type,
      category_id,
      items,
      currency = Currency.VND,
    } = params;

    let category = null;

    if (category_id) {
      category = await this.categoryProductRepository.findUniqueCategoryProduct({
        id: category_id,
        userId,
      });
      if (!category) {
        throw new Error(Messages.CATEGORY_PRODUCT_NOT_FOUND);
      }
    }

    if (!id) {
      throw new Error(Messages.MISSING_PARAMS_INPUT + ' id');
    }

    const foundProduct = await this.productRepository.findProductById({ id });
    if (!foundProduct) {
      throw new Error(Messages.PRODUCT_NOT_FOUND);
    }

    const updatedProduct = await this.productRepository.updateProduct(
      {
        id,
        userId,
      },
      {
        ...(category && { catId: category_id }),
        ...(icon && { icon }),
        ...(name && { name }),
        ...(description && { description }),
        ...(tax_rate && { taxRate: tax_rate }),
        ...(price && { price }),
        ...(type && { type }),
        ...(currency && { currency }),
        updatedBy: userId,
      },
    );

    if (!updatedProduct) {
      throw new Error(Messages.UPDATE_PRODUCT_FAILED);
    }

    // update product items
    if (items && Array.isArray(items)) {
      const updatePromises = items.map(async (item) => {
        const { id: itemId, ...itemData } = item;
        if (itemId) {
          return this.categoryProductRepository.updateCategoryProduct(
            {
              id: itemId,
              userId,
            },
            {
              ...itemData,
              updatedBy: userId,
            },
          );
        }
      });

      const updateCategoryProductItems = await Promise.all(updatePromises);
      if (!updateCategoryProductItems) {
        throw new InternalServerError(Messages.UPDATE_PRODUCT_ITEM_FAILED);
      }
    }

    return updatedProduct;
  }

  async deleteProduct(params: { userId: string; id: string }) {
    const { userId, id } = params;

    const foundProduct = (await this.productRepository.findProductById(
      { id, userId },
      {
        include: {
          transactions: true,
        },
      },
    )) as Product & { transactions: any[] };
    if (!foundProduct) {
      throw new Error(Messages.PRODUCT_NOT_FOUND);
    }

    if (foundProduct.transactions.length > 0) {
      throw new Error(Messages.TRANSACTION_DELETE_FAILED_CONSTRAINT);
    }

    const deletedProduct = await this.productRepository.deleteProduct({ id, userId });
    if (!deletedProduct) {
      throw new Error(Messages.DELETE_PRODUCT_FAILED);
    }

    return deletedProduct;
  }

  async transferProductTransaction(params: { sourceId: string; targetId: string; userId: string }) {
    const { sourceId, targetId, userId } = params;
    if (!sourceId || !targetId) {
      throw new Error(Messages.MISSING_PARAMS_INPUT + ' sourceId or targetId');
    }

    // Checking existence of source and target products
    const sourceProduct = await this.productRepository.findProductById({ id: sourceId });
    if (!sourceProduct) {
      throw new Error(Messages.SOURCE_PRODUCT_NOT_FOUND);
    }

    const targetProduct = await this.productRepository.findProductById({ id: targetId });
    if (!targetProduct) {
      throw new Error(Messages.TARGET_PRODUCT_NOT_FOUND);
    }

    if (sourceProduct === targetProduct) {
      throw new Error(Messages.SOURCE_PRODUCT_TRANSFER_SELF_FAILED);
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get all ProductTransaction entries for the source product
      const productTransactions = await tx.productTransaction.findMany({
        where: { productId: sourceProduct.id },
      });

      if (productTransactions.length === 0) {
        // delete the source product if no transactions are found
        await tx.product.delete({
          where: { id: sourceProduct.id },
        });
        return {
          transferred: 0,
          deleted: true,
        };
      }

      // 2. Transfer transactions to target product
      await tx.productTransaction.updateMany({
        where: { productId: sourceProduct.id },
        data: {
          productId: targetProduct.id,
          updatedAt: new Date(),
          updatedBy: userId, // Assuming you have user in req
        },
      });

      // 3. Verify no transactions remain with source product
      const remainingTransactions = await tx.productTransaction.count({
        where: { productId: sourceProduct.id },
      });

      if (remainingTransactions > 0) {
        throw new Error(Messages.TRANSFER_TRANSACTION_FAILED);
      }

      // 4. Delete the source product
      await tx.product.delete({
        where: { id: sourceProduct.id },
      });

      return {
        transferred: productTransactions.length,
        deleted: true,
      };
    });

    return result;
  }
}

// Export a single instance using the exported productRepository
export const productUseCase = new ProductUseCase(productRepository, categoryProductRepository);
