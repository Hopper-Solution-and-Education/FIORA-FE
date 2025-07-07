import {
  FaqsListCategoriesResponse,
  FaqsListResponse,
  FaqsListQueryParams,
} from '../../domain/entities/models/faqs';
import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

export class GetFaqsListUseCase {
  constructor(private faqsRepository: IFaqsRepository) {}

  async execute(params: FaqsListQueryParams): Promise<FaqsListResponse> {
    try {
      return await this.faqsRepository.getFaqsList(params);
    } catch (error) {
      console.error('Error in GetFaqsListUseCase:', error);
      throw error;
    }
  }

  async executeByCategories(params: FaqsListQueryParams): Promise<FaqsListCategoriesResponse> {
    try {
      return await this.faqsRepository.getFaqsListByCategories(params);
    } catch (error) {
      console.error('Error in GetFaqsListUseCase (by categories):', error);
      throw error;
    }
  }
}
