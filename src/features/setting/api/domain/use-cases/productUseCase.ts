import { Messages } from '@/shared/constants/message';

import { prisma } from '@/config';
import { GlobalFilters, PaginationResponse, ProductItem, TransactionType } from '@/shared/types';
import { Currency, Prisma, Product, ProductType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { BooleanUtils } from '@/shared/lib';
import { buildWhereClause } from '@/shared/utils';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { normalizeVietnamese, safeString } from '@/shared/utils/ExStringUtils';
import { NextApiRequest } from 'next';
import { categoryProductRepository } from '../../infrastructure/repositories/categoryProductRepository';
import { currencySettingRepository } from '../../infrastructure/repositories/currencySettingRepository';
import { productRepository } from '../../infrastructure/repositories/productRepository';
import { productItemsRepository } from '../../infrastructure/repositories/productRepositoryItem';
import { ICategoryProductRepository } from '../../repositories/categoryProductRepository.interface';
import { ICurrencySettingRepository } from '../../repositories/currencySettingRepository.interface';
import { IProductItemsRepository } from '../../repositories/productItemRepository.interface';
import {
  IProductRepository,
  ProductCreation,
  ProductUpdate,
} from '../../repositories/productRepository.interface';
import { DEFAULT_BASE_CURRENCY } from '@/shared/constants';

class ProductUseCase {
  private productRepository: IProductRepository;
  private productItemsRepository: IProductItemsRepository;
  private categoryProductRepository: ICategoryProductRepository;
  private currencySettingRepository: ICurrencySettingRepository;
  constructor(
    productRepository: IProductRepository,
    productItemsRepository: IProductItemsRepository,
    categoryProductRepository: ICategoryProductRepository,
    currencySettingRepository: ICurrencySettingRepository,
  ) {
    this.productRepository = productRepository;
    this.productItemsRepository = productItemsRepository;
    this.categoryProductRepository = categoryProductRepository;
    this.currencySettingRepository = currencySettingRepository;
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
        {
          skip: (page - 1) * pageSize,
          take: pageSize,
        },
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
          (await convertCurrency(product.price, product.currency!, currency)) ||
          product.price.toNumber();

        return {
          ...product,
          price: new Decimal(transformedPrice),
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
      throw new Error('Failed to get all products1 ', error.message);
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
        { id, userId },
        {
          include: {
            items: {
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

      const [createdBy, updatedBy] = await Promise.all([
        product.createdBy
          ? prisma.user.findFirst({
            where: { id: product.createdBy },
            select: { id: true, name: true, email: true, image: true },
          })
          : null,
        product.updatedBy
          ? prisma.user.findFirst({
            where: { id: product.updatedBy },
            select: { id: true, name: true, email: true, image: true },
          })
          : null,
      ]);

      return {
        ...product,
        createdBy: createdBy || null,
        updatedBy: updatedBy || null,
      };
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
        currency,
      } = params;

      const category = await this.categoryProductRepository.findUniqueCategoryProduct({
        id: category_id,
        userId,
      });

      if (!category) {
        throw new Error(Messages.CATEGORY_PRODUCT_NOT_FOUND);
      }

      const foundCurrency = await this.currencySettingRepository.findFirstCurrency({
        name: currency,
      });

      if (!foundCurrency) {
        throw new Error(Messages.CURRENCY_NOT_FOUND);
      }

      const result = await prisma.$transaction(async (tx) => {
        // checked if the product tenant of user already exists
        const foundTenantProduct = await tx.product.findUnique({
          where: {
            userId_name_catId: {
              userId,
              name,
              catId: category_id,
            },
          },
        });

        if (foundTenantProduct) {
          throw new Error(Messages.DUPLICATE_PRODUCT_TENANT_ERROR);
        }

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
            currencyId: foundCurrency.id,
            currency: foundCurrency.name,
            ...(description && { description }),
          },
          include: {
            items: true,
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

          product['items'] = itemsRes as unknown as ProductItem[];
        }

        return product;
      });

      return result;
    } catch (error: any) {
      throw new Error(error.message || Messages.CREATE_PRODUCT_FAILED);
    }
  }

  async filterProductOptions(params: GlobalFilters, userId: string) {
    const searchParams = safeString(params.search);
    let where = buildWhereClause(params.filters) as Prisma.ProductWhereInput;

    if (BooleanUtils.isTrue(searchParams)) {
      const typeSearchParams = searchParams.toLowerCase();

      where = {
        AND: [
          where,
          {
            OR: [
              { name: { contains: typeSearchParams, mode: 'insensitive' } },
              { items: { some: { name: { contains: typeSearchParams, mode: 'insensitive' } } } },
            ],
          },
        ],
      };
    }

    const productFiltered = await this.productRepository.findManyProducts(
      {
        ...where,
        userId: userId,
      },
      {
        include: {
          transactions: true,
          items: {
            select: {
              id: true,
              name: true,
              description: true,
              icon: true,
            },
          },
        },
        orderBy: { transactions: { _count: 'desc' } },
      },
    );
    return productFiltered;
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
      deleteItemsId = [],
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

    const foundProduct = await this.productRepository.findProductById({ id, userId });
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
        ...(price && { price }),
        ...(type && { type }),
        ...(currency && { currency }),
        taxRate: new Decimal(tax_rate),
        updatedBy: userId,
      },
    );

    if (!updatedProduct) {
      throw new Error(Messages.UPDATE_PRODUCT_FAILED);
    }

    // update product items
    if (items && Array.isArray(items)) {
      for await (const item of items) {
        if (item.id) {
          await this.productItemsRepository.updateProductItems(
            { id: item.id, userId },
            {
              icon: item.icon,
              name: item.name,
              description: item.description,
              updatedBy: userId,
            },
          );
        } else {
          await this.productItemsRepository.createProductItems({
            icon: item.icon,
            name: item.name,
            description: item.description,
            userId,
            productId: updatedProduct.id,
            createdBy: userId,
          });
        }
      }

      // delete product items
      if (deleteItemsId && Array.isArray(deleteItemsId)) {
        for await (const itemId of deleteItemsId) {
          await this.productItemsRepository.deleteProductItems({ id: itemId, userId });
        }
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

  async fetchProductCategories(req: NextApiRequest, userId: string, currency: string) {
    const { page = 1, pageSize = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const params = req.body as GlobalFilters;
    const searchParams = safeString(params.search);

    let where: Prisma.ProductWhereInput = {};
    let products: any[] = [];
    let categories: any[] = [];
    let count = 0;

    if (params.filters && Object.keys(params.filters).length > 0) {
      where = buildWhereClause(params.filters) as Prisma.ProductWhereInput;
    }

    let rawUnaccentProducts: any[] = [];

    if (BooleanUtils.isTrue(searchParams)) {
      try {
        const typeSearchParams = searchParams.toLowerCase();
        where = {
          AND: [
            where,
            {
              OR: [
                { name: { contains: typeSearchParams, mode: 'insensitive' } },
                { items: { some: { name: { contains: typeSearchParams, mode: 'insensitive' } } } },
                { category: { name: { contains: typeSearchParams, mode: 'insensitive' } } },
              ],
            },
          ],
        };

        const normalized = normalizeVietnamese(typeSearchParams);
        const rawQuery = `
        SELECT p.*
        FROM "Product" p
        LEFT JOIN "ProductItems" i ON i."productId" = p."id"
        LEFT JOIN "CategoryProducts" cp ON cp."id" = p."catId"
        WHERE p."userId"::text = $1
          AND (
            unaccent(p."name") ILIKE unaccent('%' || $2 || '%')
            OR unaccent(i."name") ILIKE unaccent('%' || $2 || '%')
            OR unaccent(cp."name") ILIKE unaccent('%' || $2 || '%')
          )
        GROUP BY p.id;
      `;
        rawUnaccentProducts = await prisma.$queryRawUnsafe(rawQuery, userId, normalized);
      } catch (err) {
        console.error('Fallback search with unaccent failed', err);
      }
    }

    let matchedCatIds: string[] = [];

    if (rawUnaccentProducts.length > 0) {
      matchedCatIds = Array.from(new Set(rawUnaccentProducts.map((p) => p.catId).filter(Boolean)));
    } else {
      const filteredProducts = await prisma.product.findMany({
        where: { userId, ...where },
        select: { id: true, catId: true },
      });

      matchedCatIds = Array.from(
        new Set(filteredProducts.map((p) => p.catId).filter((id): id is string => id !== null)),
      );
    }

    if (matchedCatIds.length === 0) {
      return {
        data: [],
        page: Number(page),
        pageSize: Number(pageSize),
        totalPage: 0,
        totalCount: 0,
        minPrice: 0,
        maxPrice: 0,
        minTaxRate: 0,
        maxTaxRate: 0,
        minExpense: 0,
        maxExpense: 0,
        minIncome: 0,
        maxIncome: 0,
      };
    }

    [categories, count] = await Promise.all([
      prisma.categoryProducts.findMany({
        where: { userId, id: { in: matchedCatIds } },
        skip,
        take,
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          tax_rate: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
        },
        orderBy: { name: 'asc' },
      }),
      prisma.categoryProducts.count({
        where: { userId, id: { in: matchedCatIds } },
      }),
    ]);

    const paginatedCatIds = categories.map((cat) => cat.id);

    products = await prisma.product.findMany({
      where: {
        catId: { in: paginatedCatIds },
        userId,
        ...where,
      },
      select: {
        id: true,
        price: true,
        name: true,
        type: true,
        description: true,
        taxRate: true,
        catId: true,
        icon: true,
        currency: true,
        items: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
          },
        },
      },
    });

    const productIds = products.map((product) => product.id);
    const foundProduct = await prisma.productTransaction.findMany({
      where: {
        productId: { in: productIds },
        transaction: { userId },
      },
      select: {
        productId: true,
        transaction: {
          select: {
            id: true,
            userId: true,
            type: true,
            amount: true,
            currency: true,
            baseCurrency: true,
            baseAmount: true,
          },
        },
      },
    });

    const productTransactions = productIds.length > 0 ? foundProduct : [];

    const creatorIds = categories.map((cat) => cat.createdBy).filter(Boolean) as string[];
    const updatorIds = categories.map((cat) => cat.updatedBy).filter(Boolean) as string[];
    const uniqueUserIds = Array.from(new Set([...creatorIds, ...updatorIds]));

    const foundUsers = await prisma.user.findMany({
      where: { id: { in: uniqueUserIds } },
      select: { id: true, name: true, email: true, image: true },
    });

    const users = uniqueUserIds.length > 0 ? foundUsers : [];

    const userMap = users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<
        string,
        { id: string; name: string | null; email: string | null; image: string | null }
      >,
    );

    const productTransactionMap = productTransactions.reduce(
      (acc, pt) => {
        if (!acc[pt.productId]) acc[pt.productId] = [];
        acc[pt.productId].push({
          id: pt.transaction.id,
          userId: pt.transaction.userId,
          type: pt.transaction.type,
          amount: pt.transaction.amount.toNumber(),
          currency: pt.transaction.currency!,
          baseCurrency: pt.transaction.baseCurrency!,
          baseAmount: pt.transaction.baseAmount?.toNumber() || 0,
        });
        return acc;
      },
      {} as Record<string, TransactionType[]>,
    );

    const productsByCategory = products.reduce(
      async (acc, product) => {
        const catId = product.catId;
        if (catId) {
          if (!acc[catId]) acc[catId] = [];
          const transactions = productTransactionMap[product.id] || [];

          const convertPrice = await convertCurrency(product.price, product.currency, currency);

          acc[catId].push({
            product: {
              id: product.id,
              price: convertPrice,
              name: product.name,
              type: product.type,
              description: product.description,
              items: product.items,
              taxRate: product.taxRate?.toNumber() || 0,
              catId: product.catId,
              icon: product.icon,
              currency: product.currency,
              baseCurrency: product.baseCurrency,
              baseAmount: product.baseAmount?.toNumber() || 0,
            },
            transactions,
          });
        }
        return acc;
      },
      {} as Record<string, Array<{ product: ProductType; transactions: TransactionType[] }>>,
    );

    const transformedData = categories.map((category) => {
      const createdBy = category.createdBy ? userMap[category.createdBy] || null : null;
      const updatedBy = category.updatedBy ? userMap[category.updatedBy] || null : null;
      const categoryProducts = productsByCategory[category.id] || [];
      return {
        category: {
          id: category.id,
          name: category.name,
          description: category.description,
          icon: category.icon,
          tax_rate: category.tax_rate?.toNumber() || 0,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          createdBy,
          updatedBy,
        },
        products: categoryProducts,
      };
    });

    const totalPage = Math.ceil(count / take);

    const priceList: number[] = [];
    const taxRateList: number[] = [];
    const incomeTotals: number[] = [];
    const expenseTotals: number[] = [];

    for await (const category of transformedData) {
      for await (const item of category.products) {
        const { taxRate, baseAmount } = item.product;
        priceList.push(baseAmount || 0);
        taxRateList.push(taxRate);

        const transactions = item.transactions;
        const totalIncome = transactions
          .filter((tx: any) => tx.type === 'Income')
          .reduce(
            async (sum: any, tx: any) =>
              sum + (await convertCurrency(tx.baseAmount, DEFAULT_BASE_CURRENCY, currency)),
            0,
          );
        const totalExpense = transactions
          .filter((tx: any) => tx.type === 'Expense')
          .reduce(
            async (sum: any, tx: any) =>
              sum + (await convertCurrency(tx.baseAmount, DEFAULT_BASE_CURRENCY, currency)),
            0,
          );

        incomeTotals.push(totalIncome);
        expenseTotals.push(totalExpense);
      }
    }

    const [minPrice, maxPrice] = this.computeMinMax(priceList);
    const [minTaxRate, maxTaxRate] = this.computeMinMax(taxRateList);
    const [minIncome, maxIncome] = this.computeMinMax(incomeTotals);
    const [minExpense, maxExpense] = this.computeMinMax(expenseTotals);

    return {
      data: transformedData,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPage,
      totalCount: count,
      minPrice,
      maxPrice,
      minTaxRate,
      maxTaxRate,
      minExpense,
      maxExpense,
      minIncome,
      maxIncome,
    };
  }

  computeMinMax(arr: number[]): [number, number] {
    if (arr.length === 0) return [0, 0];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return min === max ? [0, max] : [min, max];
  }
}

// Export a single instance using the exported productRepository
export const productUseCase = new ProductUseCase(
  productRepository,
  productItemsRepository,
  categoryProductRepository,
  currencySettingRepository,
);
