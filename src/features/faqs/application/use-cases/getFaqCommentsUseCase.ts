import { FaqComment } from '../../domain/entities/models/faqs';
import { IFaqCommentRepository } from '../../domain/repositories/IFaqCommentRepository';
import { faqCommentRepository } from '../../infrastructure/repositories';

export class GetFaqCommentsUseCase {
  constructor(private readonly faqCommentRepository: IFaqCommentRepository) {}

  async execute(faqId: string): Promise<FaqComment[]> {
    try {
      return await this.faqCommentRepository.getFaqComments(faqId);
    } catch (error) {
      console.error('Error in GetFaqCommentsUseCase:', error);
      throw error;
    }
  }
}

export const getFaqCommentsUseCase = new GetFaqCommentsUseCase(faqCommentRepository);
