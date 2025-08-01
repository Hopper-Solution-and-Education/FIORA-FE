import {
  FaqListResponse,
  FaqsListQueryParams,
} from '@/features/helps-center/domain/entities/models/faqs';
import { IFaqRepository } from '@/features/helps-center/domain/repositories';
import { faqRepository } from '../../../infrastructure/repositories';

export class GetFaqListUseCase {
  constructor(private faqsRepository: IFaqRepository) {}

  async execute(params: FaqsListQueryParams): Promise<FaqListResponse> {
    try {
      return await this.faqsRepository.getFaqList(params);
    } catch (error) {
      console.error('Error in GetFaqListUseCase:', error);
      throw error;
    }
  }
}

export const getFaqListUseCase = new GetFaqListUseCase(faqRepository);
