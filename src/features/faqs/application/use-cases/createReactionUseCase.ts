import { ReactionType } from '../../domain/entities/models/faqs';
import { IFaqReactionRepository } from '../../domain/repositories/IFaqReactionRepository';
import { IFaqRepository } from '../../domain/repositories/IFaqRepository';
import { faqReactionRepository, faqRepository } from '../../infrastructure/repositories';

export interface CreateReactionUseCaseRequest {
  faqId: string;
  userId: string;
  reactionType: ReactionType;
}

export class CreateReactionUseCase {
  constructor(
    private readonly faqReactionRepository: IFaqReactionRepository,
    private readonly faqRepository: IFaqRepository,
  ) {}

  async execute(request: CreateReactionUseCaseRequest): Promise<void> {
    const { faqId, userId, reactionType } = request;

    // Validate that FAQ exists
    const existingFaq = await this.faqRepository.getFaqDetail(faqId);
    if (!existingFaq) {
      throw new Error('FAQ not found');
    }

    // Validate that the reaction type is valid
    if (!Object.values(ReactionType).includes(reactionType)) {
      throw new Error('Invalid reaction type');
    }

    // Create or update the reaction
    await this.faqReactionRepository.createOrUpdateReaction(faqId, userId, reactionType);
  }
}

export const createReactionUseCase = new CreateReactionUseCase(
  faqReactionRepository,
  faqRepository,
);
