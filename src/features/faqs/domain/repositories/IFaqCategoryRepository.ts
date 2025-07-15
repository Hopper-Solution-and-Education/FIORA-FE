import {
  FaqsCategoriesResponse,
  FaqsCategoriesWithPostParams,
  FaqsCategoriesWithPostResponse,
} from '../entities/models/faqs';

export interface IFaqCategoryRepository {
  findOrCreateCategory(categoryName: string, type: string, userId: string): Promise<string | null>;

  getFaqCategories(): Promise<FaqsCategoriesResponse[]>;

  createFaqCategory(
    categoryName: string,
    type: string,
    userId: string,
  ): Promise<FaqsCategoriesResponse>;

  getFaqCategoriesWithPost(
    params: FaqsCategoriesWithPostParams,
  ): Promise<FaqsCategoriesWithPostResponse[]>;
}
