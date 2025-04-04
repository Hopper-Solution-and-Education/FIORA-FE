import {
  CategoryProductCreateRequest,
  CategoryProductCreateResponse,
  CategoryProductDeleteRequest,
  CategoryProductDeleteResponse,
  CategoryProductGetResponse,
  CategoryProductUpdateRequest,
  CategoryProductUpdateResponse,
} from '../../domain/entities/Category';
import { CategoryProductCreateRequestDTO } from '../dto/request/CategoryProductCreateRequestDTO';
import { CategoryProductDeleteRequestDTO } from '../dto/request/CategoryProductDeleteRequestDTO';
import { CategoryProductGetRequestDTO } from '../dto/request/CategoryProductGetRequestDTO';
import { CategoryProductUpdateRequestDTO } from '../dto/request/CategoryProductUpdateRequestDTO';
import { CategoryProductCreateResponseDTO } from '../dto/response/CategoryProductCreateResponseDTO';
import { CategoryProductDeleteResponseDTO } from '../dto/response/CategoryProductDeleteResponseDTO';
import { CategoryProductGetResponseDTO } from '../dto/response/CategoryProductGetResponseDTO';
import { CategoryProductUpdateResponseDTO } from '../dto/response/CategoryProductUpdateResponseDTO';

class CategoryProductMapper {
  // Get Category ------------------------------
  static toGetCategoryProductAPIRequest(
    requestDTO: CategoryProductGetRequestDTO,
  ): CategoryProductGetRequestDTO {
    return requestDTO;
  }

  static toGetCategoryProductDomainResponse(
    apiResponse: CategoryProductGetResponseDTO,
  ): CategoryProductGetResponse {
    return {
      page: apiResponse.data.page,
      pageSize: apiResponse.data.pageSize,
      totalPage: apiResponse.data.totalPage,
      data: apiResponse.data.data.map((item: any) => ({
        id: item.id,
        userId: item.userId,
        icon: item.icon,
        name: item.name,
        description: item.description,
        taxRate: Number(item.tax_rate),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    };
  }

  // Create Category Product ------------------------------
  static toCreateCategoryProductAPIRequest(
    request: CategoryProductCreateRequest,
  ): CategoryProductCreateRequestDTO {
    return {
      icon: request.icon,
      name: request.name,
      userId: request.userId,
      description: request.description ?? undefined,
      tax_rate: request.taxRate,
    };
  }

  static toCreateCategoryProductDomainResponse(
    apiResponse: CategoryProductCreateResponseDTO,
  ): CategoryProductCreateResponse {
    return {
      id: apiResponse.data.id,
      icon: apiResponse.data.icon,
      name: apiResponse.data.name,
      description: apiResponse.data.description,
      taxRate: Number(apiResponse.data.tax_rate),
      createdAt: apiResponse.data.createdAt,
      updatedAt: apiResponse.data.updatedAt,
    };
  }

  // Update Category Product ------------------------------
  static toUpdateCategoryProductAPIRequest(
    request: CategoryProductUpdateRequest,
  ): CategoryProductUpdateRequestDTO {
    return {
      id: request.id,
      userId: request.userId,
      icon: request.icon,
      name: request.name,
      description: request.description ?? undefined,
      tax_rate: request.taxRate,
    };
  }

  static toUpdateCategoryProductDomainResponse(
    apiResponse: CategoryProductUpdateResponseDTO,
  ): CategoryProductUpdateResponse {
    return {
      id: apiResponse.data.id,
      userId: apiResponse.data.userId,
      icon: apiResponse.data.icon,
      name: apiResponse.data.name,
      description: apiResponse.data.description,
      taxRate: Number(apiResponse.data.tax_rate),
      createdAt: apiResponse.data.createdAt,
      updatedAt: apiResponse.data.updatedAt,
    };
  }

  // Delete Category Product ------------------------------
  static toDeleteCategoryProductAPIRequest(
    request: CategoryProductDeleteRequest,
  ): CategoryProductDeleteRequestDTO {
    return {
      productCategoryId: request.productCategoryId,
    };
  }

  static toDeleteCategoryProductDomainResponse(
    apiResponse: CategoryProductDeleteResponseDTO,
  ): CategoryProductDeleteResponse {
    return {
      message: apiResponse.message,
      categoryProductId: apiResponse.data.categoryProductId,
    };
  }
}

export default CategoryProductMapper;
