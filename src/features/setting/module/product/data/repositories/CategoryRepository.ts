import { decorate, injectable } from 'inversify';
import {
  CategoryProductCreateRequest,
  CategoryProductCreateResponse,
  CategoryProductDeleteRequest,
  CategoryProductDeleteResponse,
  CategoryProductGetResponse,
  CategoryProductUpdateRequest,
  CategoryProductUpdateResponse,
} from '../../domain/entities/Category';
import type { ICategoryAPI } from '../api/categoryApi';
import { CategoryProductGetRequestDTO } from '../dto/request/CategoryProductGetRequestDTO';
import CategoryProductMapper from '../mapper/CategoryProductMappter';

export interface ICategoryRepository {
  getListCategoryProduct: (
    sectionType: CategoryProductGetRequestDTO,
  ) => Promise<CategoryProductGetResponse>;

  createCategoryProduct(
    request: CategoryProductCreateRequest,
  ): Promise<CategoryProductCreateResponse>;

  updateCategoryProduct(
    request: CategoryProductUpdateRequest,
  ): Promise<CategoryProductUpdateResponse>;

  deleteCategoryProduct(
    request: CategoryProductDeleteRequest,
  ): Promise<CategoryProductDeleteResponse>;
}

export class CategoryRepository implements ICategoryRepository {
  private categoryAPI: ICategoryAPI;

  constructor(categoryAPI: ICategoryAPI) {
    this.categoryAPI = categoryAPI;
  }

  async getListCategoryProduct(
    request: CategoryProductGetRequestDTO,
  ): Promise<CategoryProductGetResponse> {
    const requestDTO = CategoryProductMapper.toGetCategoryProductAPIRequest(request);
    const response = await this.categoryAPI.fetchCategories(requestDTO);
    return CategoryProductMapper.toGetCategoryProductDomainResponse(response);
  }

  async createCategoryProduct(
    request: CategoryProductCreateRequest,
  ): Promise<CategoryProductCreateResponse> {
    const requestAPI = CategoryProductMapper.toCreateCategoryProductAPIRequest(request);
    const response = await this.categoryAPI.createCategory(requestAPI);
    return CategoryProductMapper.toCreateCategoryProductDomainResponse(response);
  }

  async updateCategoryProduct(
    request: CategoryProductUpdateRequest,
  ): Promise<CategoryProductUpdateResponse> {
    const requestAPI = CategoryProductMapper.toUpdateCategoryProductAPIRequest(request);
    const response = await this.categoryAPI.updateCategory(requestAPI);
    return CategoryProductMapper.toUpdateCategoryProductDomainResponse(response);
  }

  async deleteCategoryProduct(
    request: CategoryProductDeleteRequest,
  ): Promise<CategoryProductDeleteResponse> {
    const requestAPI = CategoryProductMapper.toDeleteCategoryProductAPIRequest(request);
    const response = await this.categoryAPI.deleteCategory(requestAPI);
    return CategoryProductMapper.toDeleteCategoryProductDomainResponse(response);
  }
}

// Apply decorators programmatically
decorate(injectable(), CategoryRepository);

// Create a factory function
export const createCategoryRepository = (categoryAPI: ICategoryAPI): ICategoryRepository => {
  return new CategoryRepository(categoryAPI);
};
