import { ProductFormValues } from '../../presentation/schema/addProduct.schema';

import { format } from 'date-fns';
import {
  Product,
  ProductDeleteRequest,
  ProductDeleteResponse,
  ProductGetSingleResponse,
  ProductGetTransactionRequest,
  ProductGetTransactionResponse,
  ProductItem,
  ProductsGetResponse,
  ProductTransferDeleteRequest,
  ProductTransferDeleteResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
  Transaction,
} from '../../domain/entities';
import {
  ProductCreateRequestDTO,
  ProductDeleteRequestDTO,
  ProductGetSingleRequestDTO,
  ProductGetTransactionRequestDTO,
  ProductTransferDeleteRequestDTO,
  ProductUpdateRequestDTO,
} from '../dto/request';
import {
  ProductDeleteResponseDTO,
  ProductGetSingleResponseDTO,
  ProductGetTransactionResponseDTO,
  ProductsGetResponseDTO,
  ProductTransferDeleteResponseDTO,
  ProductUpdateResponseDTO,
} from '../dto/response';

// Define constants for default values
const DEFAULT_MAX_PRICE = 10000;
const DEFAULT_MAX_TAX_RATE = 100;
const DEFAULT_MAX_EXPENSE = 10000;
const DEFAULT_MAX_INCOME = 10000;

export class ProductMapper {
  static toGetSingleProductAPIRequest(id: string): ProductGetSingleRequestDTO {
    return {
      productId: id,
    };
  }

  static toGetSingleProductResponse(
    response: ProductGetSingleResponseDTO,
  ): ProductGetSingleResponse {
    const item = response.data;
    return {
      id: item.id,
      price: Number(item.price),
      name: item.name,
      type: item.type,
      description: item.description ?? '',
      items:
        item.items?.map(
          (item) => new ProductItem(item.id, item.name, item.icon, item.description ?? ''),
        ) ?? [],
      taxRate: Number(item.taxRate),
      catId: item.catId ?? '',
      icon: item.icon,
      currency: item.currency,
      createdAt: String(item.createdAt),
      updatedAt: String(item.updatedAt),
      transactions: item.transactions,
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
    };
  }

  static toDeleteProductAPIRequest(request: ProductDeleteRequest): ProductDeleteRequestDTO {
    return {
      id: request.id,
    };
  }

  static toDeleteProductResponse(response: ProductDeleteResponseDTO): ProductDeleteResponse {
    return {
      id: response.data.id,
    };
  }

  static toGetProductTransactionAPIRequest(
    request: ProductGetTransactionRequest,
  ): ProductGetTransactionRequestDTO {
    return {
      page: request.page,
      pageSize: request.pageSize,
      filters: request.filters as unknown as Record<string, unknown>,
      search: request.search,
      userId: request.userId,
    };
  }

  static toGetProductTransactionResponse(
    response: ProductGetTransactionResponseDTO,
  ): ProductGetTransactionResponse {
    return {
      data: response.data.data.map((item) => ({
        category: {
          id: item.category.id,
          name: item.category.name,
          icon: item.category.icon,
          description: item.category.description ?? '',
          createdAt: item.category.created_at,
          updatedAt: item.category.updated_at,
          taxRate: item.category.tax_rate ?? 0,
        },
        products: item.products.map((productItem) => ({
          product: {
            id: productItem.product.id,
            price: Number(productItem.product.price),
            name: productItem.product.name,
            type: productItem.product.type,
            description: productItem.product.description ?? '',
            items:
              productItem.product.items?.map(
                (item) => new ProductItem(item.id, item.name, item.icon, item.description),
              ) ?? null,
            taxRate: productItem.product.taxRate ? Number(productItem.product.taxRate) : 0,
            catId: productItem.product.catId ?? '',
            icon: productItem.product.icon,
            createdAt: productItem.product.created_at,
            updatedAt: productItem.product.updated_at,
          },
          transactions: productItem.transactions,
        })),
      })),
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalPage: response.data.totalPage,
      minPrice: response.data.minPrice ?? 0,
      maxPrice: response.data.maxPrice ?? DEFAULT_MAX_PRICE,
      minTaxRate: response.data.minTaxRate ?? 0,
      maxTaxRate: response.data.maxTaxRate ?? DEFAULT_MAX_TAX_RATE,
      minExpense: response.data.minExpense ?? 0,
      maxExpense: response.data.maxExpense ?? DEFAULT_MAX_EXPENSE,
      minIncome: response.data.minIncome ?? 0,
      maxIncome: response.data.maxIncome ?? DEFAULT_MAX_INCOME,
      hasMore: response.data.page < response.data.totalPage,
    };
  }

  static toCreateProductAPIRequest(request: ProductFormValues): ProductCreateRequestDTO {
    return {
      icon: request.icon,
      name: request.name,
      description: request.description,
      tax_rate: request.taxRate,
      price: request.price ?? 0,
      type: request.type,
      category_id: request.catId,
      items: request.items?.map(
        (item) => new ProductItem(item.itemId ?? '', item.name, item.icon, item.description ?? ''),
      ),
      currency: request.currency,
    };
  }

  static toUpdateProductAPIRequest(request: ProductUpdateRequest): ProductUpdateRequestDTO {
    const deleteItemsId = request.deletedItemsId?.filter((id) => id !== null && id !== undefined);
    const data = {
      id: request.id ?? '',
      icon: request.icon,
      name: request.name,
      description: request.description,
      tax_rate: request.taxRate,
      price: request.price ?? 0,
      type: request.type,
      category_id: request.catId,
      items: request.items?.map(
        (item) => new ProductItem(item.itemId ?? '', item.name, item.icon, item.description ?? ''),
      ),
      currency: request.currency,
      deleteItemsId: deleteItemsId && deleteItemsId.length > 0 ? deleteItemsId : undefined,
    };
    return data;
  }

  static toUpdateProductResponse(response: ProductUpdateResponseDTO): ProductUpdateResponse {
    return {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description ?? '',
      icon: response.data.icon,
      price: Number(response.data.price),
      taxRate: Number(response.data.taxRate),
      items: response.data.items ?? [],
      transactions: response.data.transactions,
      catId: response.data.catId ?? '',
      type: response.data.type,
      currency: response.data.currency,
      createdAt: new Date(response.data.createdAt).toISOString(),
      updatedAt: new Date(response.data.updatedAt).toISOString(),
      createdBy: response.data.createdBy,
      updatedBy: response.data.updatedBy,
    };
  }

  static toGetProductResponse(response: ProductsGetResponseDTO): ProductsGetResponse {
    const { data, page, pageSize, totalPage } = response.data;

    const dataResponse = {
      page,
      pageSize,
      totalPage,
      data: data.map((item) => {
        // const items: ProductItem[] = Array.isArray(item.items)
        //   ? ProductMapper.parseServerItemToList(item.items as JsonArray)
        //   : [];
        const transactions: Transaction[] =
          item.transactions?.map(
            (transaction) =>
              new Transaction(
                transaction.productId,
                transaction.transactionId,
                transaction.createdAt,
                transaction.updatedAt,
                transaction.createdBy,
                transaction.updatedBy,
              ),
          ) ?? [];

        return new Product(
          item.id,
          item.name,
          item.description ?? '',
          item.icon,
          Number(item.price),
          Number(item.taxRate),
          item.items,
          item.catId ?? '',
          item.type,
          item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm:ss') : '',
          item.updatedAt ? format(new Date(item.updatedAt), 'dd/MM/yyyy HH:mm:ss') : '',
          transactions,
          item.currency,
          item.createdBy,
          item.updatedBy,
        );
      }),
    } as ProductsGetResponse;

    return dataResponse;
  }
  static toProductTransferDeleteAPIRequest(
    request: ProductTransferDeleteRequest,
  ): ProductTransferDeleteRequestDTO {
    return {
      sourceId: request.productIdToDelete,
      targetId: request.productIdToTransfer,
    };
  }

  static toProductTransferDeleteResponse(
    response: ProductTransferDeleteResponseDTO,
  ): ProductTransferDeleteResponse {
    return {
      id: response.data.id,
    };
  }
}
