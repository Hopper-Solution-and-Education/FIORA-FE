import {
  FaqsCategoriesResponse,
  FaqsCategoriesWithPostParams,
  FaqsCategoriesWithPostResponse,
} from '@/features/helps-center/domain/entities/models/faqs';
import { IFaqCategoryRepository } from '@/features/helps-center/domain/repositories';
import { faqCategoryRepository } from '../../../infrastructure/repositories/FaqCategoryRepository';

export class GetFaqCategoriesUseCase {
  constructor(private faqCategoryRepository: IFaqCategoryRepository) {}

  async execute(): Promise<FaqsCategoriesResponse[]> {
    try {
      return await this.faqCategoryRepository.getFaqCategories();
    } catch (error) {
      console.error('Error in GetFaqCategoriesUseCase:', error);
      throw error;
    }
  }

  async executeWithPost(
    params: FaqsCategoriesWithPostParams,
  ): Promise<FaqsCategoriesWithPostResponse[]> {
    try {
      return await this.faqCategoryRepository.getFaqCategoriesWithPost(params);
    } catch (error) {
      console.error('Error in GetFaqCategoriesUseCase:', error);
      throw error;
    }
  }
}

export const getFaqCategoriesUseCase = new GetFaqCategoriesUseCase(faqCategoryRepository);
