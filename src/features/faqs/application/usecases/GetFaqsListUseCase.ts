import { FaqsListResponse } from '../../domain/entities/models/faqs';
import {
  FaqsQueryParams,
  IFaqsRepository,
  FaqsListCategoriesResponse,
} from '../../domain/repositories/IFaqsRepository';

export class GetFaqsListUseCase {
  constructor(private faqsRepository: IFaqsRepository) {}

  async execute(params: FaqsQueryParams, userId: string): Promise<FaqsListResponse> {
    try {
      return await this.faqsRepository.getFaqsList(params, userId);
    } catch (error) {
      console.error('Error in GetFaqsListUseCase:', error);
      throw error;
    }
  }

  async executeByCategories(
    params: FaqsQueryParams,
    userId: string,
  ): Promise<FaqsListCategoriesResponse> {
    try {
      return await this.faqsRepository.getFaqsListByCategories(params, userId);
    } catch (error) {
      console.error('Error in GetFaqsListUseCase (by categories):', error);
      throw error;
    }
  }
}
