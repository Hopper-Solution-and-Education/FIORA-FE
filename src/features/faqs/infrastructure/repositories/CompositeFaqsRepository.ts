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
} from '../../domain/entities/models/faqs';
import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

// Import specialized repositories
import { FaqCommentRepository } from './FaqCommentRepository';
import { FaqImportRepository } from './FaqImportRepository';
import { FaqQueryRepository } from './FaqQueryRepository';
import { FaqReactionRepository } from './FaqReactionRepository';
import { FaqRepository } from './FaqRepository';

/**
 * Composite repository that delegates to specialized repositories
 * Maintains backward compatibility with the original IFaqsRepository interface
 */
export class CompositeFaqsRepository implements IFaqsRepository {
  private readonly faqRepository: FaqRepository;
  private readonly faqCommentRepository: FaqCommentRepository;
  private readonly faqReactionRepository: FaqReactionRepository;
  private readonly faqImportRepository: FaqImportRepository;
  private readonly faqQueryRepository: FaqQueryRepository;
  constructor() {
    this.faqRepository = new FaqRepository();
    this.faqCommentRepository = new FaqCommentRepository();
    this.faqReactionRepository = new FaqReactionRepository();
    this.faqImportRepository = new FaqImportRepository();
    this.faqQueryRepository = new FaqQueryRepository();
  }

  // Delegate to FaqImportRepository
  async importFaqs(validatedRows: FaqsRowRaw[], userId: string): Promise<FaqsImportResult> {
    return this.faqImportRepository.importFaqs(validatedRows, userId);
  }

  async findOrCreateCategory(
    categoryName: string,
    type: string,
    userId: string,
  ): Promise<string | null> {
    return this.faqImportRepository.findOrCreateCategory(categoryName, type, userId);
  }

  async checkExistingTitles(titles: string[], userId: string): Promise<string[]> {
    return this.faqImportRepository.checkExistingTitles(titles, userId);
  }

  // Delegate to FaqQueryRepository
  async getFaqsList(params: FaqsListQueryParams): Promise<FaqsListResponse> {
    return this.faqQueryRepository.getFaqsList(params);
  }

  async getFaqsListByCategories(params: FaqsListQueryParams): Promise<FaqsListCategoriesResponse> {
    return this.faqQueryRepository.getFaqsListByCategories(params);
  }

  async getFaqCategories(): Promise<FaqsCategoriesResponse[]> {
    return this.faqQueryRepository.getFaqCategories();
  }

  // Delegate to FaqRepository
  async getFaqDetail(faqId: string, options?: GetFaqDetailOptions): Promise<FaqDetailData | null> {
    return this.faqRepository.getFaqDetail(faqId, options);
  }

  async updateFaq(faqId: string, updateData: UpdateFaqRequest, userId: string): Promise<void> {
    return this.faqRepository.updateFaq(faqId, updateData, userId);
  }

  async deleteFaq(faqId: string): Promise<void> {
    return this.faqRepository.deleteFaq(faqId);
  }

  async getRelatedArticles(
    categoryId: string,
    currentFaqId: string,
    limit?: number,
  ): Promise<any[]> {
    return this.faqRepository.getRelatedArticles(categoryId, currentFaqId, limit);
  }

  // Delegate to FaqReactionRepository
  async createOrUpdateReaction(
    faqId: string,
    userId: string,
    reactionType: ReactionType,
  ): Promise<void> {
    return this.faqReactionRepository.createOrUpdateReaction(faqId, userId, reactionType);
  }

  async deleteReaction(faqId: string, userId: string): Promise<void> {
    return this.faqReactionRepository.deleteReaction(faqId, userId);
  }

  // Delegate to FaqCommentRepository
  async createComment(
    faqId: string,
    userId: string,
    request: CreateCommentRequest,
  ): Promise<FaqComment> {
    return this.faqCommentRepository.createComment(faqId, userId, request);
  }

  async deleteComment(commentId: string): Promise<void> {
    return this.faqCommentRepository.deleteComment(commentId);
  }

  async incrementViewCount(faqId: string): Promise<void> {
    return this.faqRepository.incrementViewCount(faqId);
  }
}
