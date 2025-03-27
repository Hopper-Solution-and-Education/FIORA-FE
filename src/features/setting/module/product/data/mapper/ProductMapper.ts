import { JsonArray, JsonValue } from '@prisma/client/runtime/library';
import { ProductFormValues, ProductItem } from '../../presentation/schema/addProduct.schema';
import { getProductTransactionAPIResponseDTO } from './../dto/response/GetProductTransactionAPIResponseDTO';

import { format } from 'date-fns';
import {
  DeleteProductRequest,
  DeleteProductResponse,
  GetProductResponse,
  GetProductTransactionRequest,
  GetProductTransactionResponse,
  GetSingleProductResponse,
  Product,
  UpdateProductRequest,
  UpdateProductResponse,
} from '../../domain/entities/Product';
import { CreateProductAPIRequestDTO } from '../dto/request/CreateProductAPIRequestDTO';
import { DeleteProductAPIRequestDTO } from '../dto/request/DeleteProductAPIRequestDTO';
import { GetProductTransactionAPIRequestDTO } from '../dto/request/GetProductTransactionAPIRequestDTO';
import { GetSingleProductRequestDTO } from '../dto/request/GetSingleProductRequestDTO';
import { UpdateProductAPIRequestDTO } from '../dto/request/UpdateProductAPIRequestDTO';
import { DeleteProductAPIResponseDTO } from '../dto/response/DeleteProductAPIResponseDTO';
import { GetProductAPIResponseDTO } from '../dto/response/GetProductAPIResponseDTO';
import { GetSingleProductResponseDTO } from '../dto/response/GetSingleProductResponseDTO';
import { UpdateProductAPIResponseDTO } from '../dto/response/UpdateProductAPIResponseDTO';

export class ProductMapper {
  static toGetSingleProductAPIRequest(id: string): GetSingleProductRequestDTO {
    return {
      productId: id,
    };
  }

  static toGetSingleProductResponse(
    response: GetSingleProductResponseDTO,
  ): GetSingleProductResponse {
    const item = response.data;
    return {
      id: item.id,
      price: Number(item.price),
      name: item.name,
      type: item.type,
      description: item.description ?? '',
      items: ProductMapper.parseServerItemToList(item.items),
      taxRate: Number(item.taxRate),
      categoryId: item.catId ?? '',
      icon: item.icon,
      createdAt: String(item.createdAt),
      updatedAt: String(item.updatedAt),
    };
  }

  static toDeleteProductAPIRequest(request: DeleteProductRequest): DeleteProductAPIRequestDTO {
    return {
      id: request.id,
    };
  }

  static toDeleteProductResponse(response: DeleteProductAPIResponseDTO): DeleteProductResponse {
    return {
      id: response.data.id,
    };
  }

  static toGetProductTransactionAPIRequest(
    request: GetProductTransactionRequest,
  ): GetProductTransactionAPIRequestDTO {
    return {
      userId: request.userId,
      page: request.page,
      pageSize: request.pageSize,
    };
  }

  static toGetProductTransactionResponse(
    response: getProductTransactionAPIResponseDTO,
  ): GetProductTransactionResponse {
    return {
      data: response.data.data.map((item) => ({
        transaction: {
          id: item.transaction.id,
          type: item.transaction.type,
        },
        product: {
          id: item.product.id,
          price: Number(item.product.price),
          name: item.product.name,
          type: item.product.type,
          description: item.product.description ?? '',
          items: ProductMapper.parseServerItemToList(item.product.items),
          taxRate: Number(item.product.taxRate),
          catId: item.product.catId ?? '',
          icon: item.product.icon,
        },
      })),
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalPage: response.data.totalPage,
    };
  }

  static toCreateProductAPIRequest(request: ProductFormValues): CreateProductAPIRequestDTO {
    return {
      icon: request.icon,
      name: request.name,
      description: request.description,
      tax_rate: request.taxRate,
      price: request.price,
      type: request.type,
      category_id: request.categoryId,
      items: request.items,
    };
  }

  static toUpdateProductAPIRequest(request: UpdateProductRequest): UpdateProductAPIRequestDTO {
    return {
      id: request.id ?? '',
      icon: request.icon,
      name: request.name,
      description: request.description,
      tax_rate: request.taxRate,
      price: request.price,
      type: request.type,
      category_id: request.categoryId,
      items: request.items,
    };
  }

  static toUpdateProductResponse(response: UpdateProductAPIResponseDTO): UpdateProductResponse {
    return {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description ?? '',
      icon: response.data.icon,
      price: Number(response.data.price),
      taxRate: Number(response.data.taxRate),
      items: Array.isArray(response.data.items)
        ? ProductMapper.parseServerItemToList(response.data.items as JsonArray)
        : [],
      categoryId: response.data.catId ?? '',
      type: response.data.type,
      createdAt: new Date(response.data.createdAt).toISOString(),
      updatedAt: new Date(response.data.updatedAt).toISOString(),
    };
  }

  static toGetProductResponse(response: GetProductAPIResponseDTO): GetProductResponse {
    const { data, page, pageSize, totalPage } = response.data;

    return {
      page,
      pageSize,
      totalPage,
      data: data.map((item) => {
        const items: ProductItem[] = Array.isArray(item.items)
          ? ProductMapper.parseServerItemToList(item.items as JsonArray)
          : [];
        return new Product(
          item.id,
          item.name,
          item.description ?? '',
          item.icon,
          Number(item.price),
          Number(item.taxRate),
          items,
          item.catId ?? '',
          item.type,
          item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm:ss') : '',
          item.updatedAt ? format(new Date(item.updatedAt), 'dd/MM/yyyy HH:mm:ss') : '',
        );
      }),
    };
  }

  static parseServerItemToList(items: JsonValue): ProductItem[] {
    if (!Array.isArray(items)) {
      console.error(`Expected an array but received:`, items);
      return [];
    }

    const result: ProductItem[] = [];

    items.forEach((item) => {
      if (typeof item === 'string') {
        try {
          const parsedObject = JSON.parse(item);
          if (
            parsedObject &&
            typeof parsedObject === 'object' &&
            'name' in parsedObject &&
            'description' in parsedObject
          ) {
            result.push({
              name: String(parsedObject.name),
              description: String(parsedObject.description),
            });
          }
        } catch (error) {
          console.error(`Lỗi khi parse JSON:`, error);
        }
      }
    });

    return result;
  }
}
