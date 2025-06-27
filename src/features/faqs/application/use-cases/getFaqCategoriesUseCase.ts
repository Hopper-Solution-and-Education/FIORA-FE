import { FaqsCategoriesResponse } from '../../domain/entities/models/faqs';
import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

export class GetFaqCategoriesUseCase {
  constructor(private faqsRepository: IFaqsRepository) {}

  async execute(userId: string): Promise<FaqsCategoriesResponse[]> {
    try {
      return await this.faqsRepository.getFaqCategories(userId);
    } catch (error) {
      console.error('Error in GetFaqCategoriesUseCase:', error);
      throw error;
    }
  }
}
