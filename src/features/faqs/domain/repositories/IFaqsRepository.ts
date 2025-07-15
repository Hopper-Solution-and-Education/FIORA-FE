import {
  CreateCommentRequest,
  FaqComment,
  FaqDetailData,
  FaqsCategoriesResponse,
  FaqsImportResult,
  FaqsListCategoriesResponse,
  FaqsListQueryParams,
  FaqsListResponse,
  FaqsRowRaw,
  GetFaqDetailOptions,
  ReactionType,
  UpdateFaqRequest,
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

  // New methods for individual FAQ operations

  /**
   * Get FAQ detail by ID with optional includes
   */
  getFaqDetail(faqId: string, options?: GetFaqDetailOptions): Promise<FaqDetailData | null>;

  /**
   * Update FAQ by ID
   */
  updateFaq(faqId: string, updateData: UpdateFaqRequest, userId: string): Promise<void>;

  /**
   * Delete FAQ by ID
   */
  deleteFaq(faqId: string): Promise<void>;

  /**
   * Create or update reaction for FAQ
   */
  createOrUpdateReaction(faqId: string, userId: string, reactionType: ReactionType): Promise<void>;

  /**
   * Delete reaction for FAQ
   */
  deleteReaction(faqId: string, userId: string): Promise<void>;

  /**
   * Create comment for FAQ
   */
  createComment(faqId: string, userId: string, request: CreateCommentRequest): Promise<FaqComment>;

  /**
   * Delete comment by ID
   */
  deleteComment(commentId: string): Promise<void>;

  /**
   * View count increment
   */
  incrementViewCount(faqId: string): Promise<void>;

  /**
   * Get related articles for FAQ
   */
  getRelatedArticles(categoryId: string, currentFaqId: string, limit?: number): Promise<any[]>;
}
