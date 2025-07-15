import { CreateCommentRequest, FaqComment } from '../../domain/entities/models/faqs';
import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

export interface CreateCommentUseCaseRequest {
  faqId: string;
  userId: string;
  commentData: CreateCommentRequest;
}

export class CreateCommentUseCase {
  constructor(private readonly faqsRepository: IFaqsRepository) {}

  async execute(request: CreateCommentUseCaseRequest): Promise<FaqComment> {
    const { faqId, userId, commentData } = request;

    // Validate that FAQ exists
    const existingFaq = await this.faqsRepository.getFaqDetail(faqId);
    if (!existingFaq) {
      throw new Error('FAQ not found');
    }

    // Validate comment content
    if (
      !commentData.content ||
      typeof commentData.content !== 'string' ||
      !commentData.content.trim()
    ) {
      throw new Error('Invalid comment content');
    }

    // Create the comment
    return await this.faqsRepository.createComment(faqId, userId, commentData);
  }
}
