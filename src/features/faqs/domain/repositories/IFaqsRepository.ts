import {
  FaqsRowRaw,
  FaqsImportResult,
  FaqsListResponse,
  FaqsListCategoriesResponse,
  FaqsCategoriesResponse,
  FaqsListQueryParams,
} from '../entities/models/faqs';

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
  getFaqsList(params: FaqsListQueryParams): Promise<FaqsListResponse>;

  /**
   * Get FAQ categories with their FAQs
   */
  getFaqsListByCategories(params: FaqsListQueryParams): Promise<FaqsListCategoriesResponse>;

  /**
   * Get FAQ categories
   */
  getFaqCategories(): Promise<FaqsCategoriesResponse[]>;

  /**
   * Check if FAQ titles exist in the database
   */
  checkExistingTitles(titles: string[], userId: string): Promise<string[]>;
}
