import { FaqsRowRaw, FaqsImportResult, FaqsListResponse } from '../entities/models/faqs';

export interface FaqsQueryParams {
  page?: number;
  pageSize?: number;
  category?: string | string[];
  type?: string;
  search?: string;
  orderBy?: 'views' | 'createdAt' | 'updatedAt';
  limit?: number;
  groupByCategory?: boolean;
}

export interface CategoryWithFaqs {
  categoryId: string;
  categoryName: string;
  totalFaqs: number;
  faqs: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    type: any;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface FaqsListCategoriesResponse {
  categoriesData: CategoryWithFaqs[];
}

export interface IFaqsRepository {
  /**
   * Import validated FAQs data
   */
  importFaqs(validatedRows: FaqsRowRaw[], userId: string): Promise<FaqsImportResult>;

  /**
   * Find or create post category
   */
  findOrCreateCategory(categoryName: string, type: string, userId: string): Promise<string | null>;

  /**
   * Get list of FAQs with pagination and filtering
   */
  getFaqsList(params: FaqsQueryParams, userId: string): Promise<FaqsListResponse>;

  /**
   * Get FAQ categories with their FAQs
   */
  getFaqsListByCategories(
    params: FaqsQueryParams,
    userId: string,
  ): Promise<FaqsListCategoriesResponse>;

  /**
   * Get FAQ categories
   */
  getFaqCategories(userId: string): Promise<string[]>;

  /**
   * Check if FAQ titles exist in the database
   */
  checkExistingTitles(titles: string[], userId: string): Promise<string[]>;
}
