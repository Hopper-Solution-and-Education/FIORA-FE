import { FaqComment, FaqCommentParams } from '../../domain/entities/models/faqs';
import { IFaqCommentRepository } from '../../domain/repositories/IFaqCommentRepository';
import { faqCommentRepository } from '../../infrastructure/repositories';

export class GetFaqCommentsUseCase {
  constructor(private readonly faqCommentRepository: IFaqCommentRepository) {}

  async execute(params: FaqCommentParams): Promise<FaqComment[]> {
    try {
      return await this.faqCommentRepository.getFaqComments(params);
    } catch (error) {
      console.error('Error in GetFaqCommentsUseCase:', error);
      throw error;
    }
  }
}

export const getFaqCommentsUseCase = new GetFaqCommentsUseCase(faqCommentRepository);
