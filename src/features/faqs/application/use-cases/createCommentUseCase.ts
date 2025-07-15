import { Messages } from '@/shared/constants/message';
import { CreateCommentRequest, FaqComment } from '../../domain/entities/models/faqs';
import { IFaqCommentRepository, IFaqRepository } from '../../domain/repositories';
import { faqCommentRepository, faqRepository } from '../../infrastructure/repositories';

export interface CreateCommentUseCaseRequest {
  faqId: string;
  userId: string;
  commentData: CreateCommentRequest;
}

export class CreateCommentUseCase {
  constructor(
    private readonly faqCommentRepository: IFaqCommentRepository,
    private readonly faqRepository: IFaqRepository,
  ) {}

  async execute(request: CreateCommentUseCaseRequest): Promise<FaqComment> {
    const { faqId, userId, commentData } = request;

    // Validate that FAQ exists
    const existingFaq = await this.faqRepository.getFaqDetail(faqId);
    if (!existingFaq) {
      throw new Error(Messages.FAQ_NOT_FOUND);
    }

    // Validate comment content
    if (
      !commentData.content ||
      typeof commentData.content !== 'string' ||
      !commentData.content.trim()
    ) {
      throw new Error(Messages.VALIDATION_ERROR);
    }

    // Create the comment
    return await this.faqCommentRepository.createComment(faqId, userId, commentData);
  }
}

export const createCommentUseCase = new CreateCommentUseCase(faqCommentRepository, faqRepository);
