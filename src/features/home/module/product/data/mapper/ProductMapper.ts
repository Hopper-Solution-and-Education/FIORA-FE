import { JsonArray } from '@prisma/client/runtime/library';
import { ProductFormValues, ProductItem } from '../../presentation/schema/addProduct.schema';

import {
  GetProductResponse,
  Product,
  UpdateProductRequest,
  UpdateProductResponse,
} from '../../domain/entities/Product';
import { CreateProductAPIRequestDTO } from '../dto/request/CreateProductAPIRequestDTO';
import { UpdateProductAPIRequestDTO } from '../dto/request/UpdateProductAPIRequestDTO';
import { GetProductAPIResponseDTO } from '../dto/response/GetProductAPIResponseDTO';
import { UpdateProductAPIResponseDTO } from '../dto/response/UpdateProductAPIResponseDTO';

export class ProductMapper {
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
        );
      }),
    };
  }

  static parseServerItemToList(items: JsonArray): ProductItem[] {
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
