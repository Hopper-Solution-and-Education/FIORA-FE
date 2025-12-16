import { BaseResponse } from '@/shared/types';
import { format } from 'date-fns';
import {
  Product,
  ProductCreateResponse,
  ProductDeleteRequest,
  ProductDeleteResponse,
  ProductGetSingleResponse,
  ProductGetTransactionRequest,
  ProductGetTransactionResponse,
  ProductItem,
  ProductsGetResponse,
  ProductTransferDeleteResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
  Transaction,
} from '../../domain/entities';
import {
  ProductDeleteRequestDTO,
  ProductGetSingleRequestDTO,
  ProductGetTransactionRequestDTO,
  ProductUpdateRequestDTO,
} from '../dto/request';
import {
  ProductCreateResponseDTO,
  ProductDeleteResponseDTO,
  ProductGetSingleResponseDTO,
  ProductTransferDeleteResponseDTO,
  ProductUpdateResponseDTO,
} from '../dto/response';

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
      targetId: request.targetId ? request.targetId : undefined,
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
    response: BaseResponse<ProductGetTransactionResponse>,
  ): ProductGetTransactionResponse {
    return {
      items: response.data.items,
      meta: response.data.meta,
    };
  }

  static toCreateProductResponse(response: ProductCreateResponseDTO): ProductCreateResponse {
    return {
      ...response.data,
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

  static toGetProductResponse(response: BaseResponse<ProductsGetResponse>): ProductsGetResponse {
    const data = response.data.items;

    const dataResponse = {
      items: data.map((item) => {
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
      meta: { ...response.data.meta },
    } as ProductsGetResponse;

    return dataResponse;
  }

  static toProductTransferDeleteResponse(
    response: ProductTransferDeleteResponseDTO,
  ): ProductTransferDeleteResponse {
    return {
      id: response.data.id,
    };
  }
}
