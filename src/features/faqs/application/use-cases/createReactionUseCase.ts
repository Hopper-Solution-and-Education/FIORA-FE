import { ReactionType } from '../../domain/entities/models/faqs';
import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

export interface CreateReactionUseCaseRequest {
  faqId: string;
  userId: string;
  reactionType: ReactionType;
}

export class CreateReactionUseCase {
  constructor(private readonly faqsRepository: IFaqsRepository) {}

  async execute(request: CreateReactionUseCaseRequest): Promise<void> {
    const { faqId, userId, reactionType } = request;

    // Validate that FAQ exists
    const existingFaq = await this.faqsRepository.getFaqDetail(faqId);
    if (!existingFaq) {
      throw new Error('FAQ not found');
    }

    // Validate that the reaction type is valid
    if (!Object.values(ReactionType).includes(reactionType)) {
      throw new Error('Invalid reaction type');
    }

    // Create or update the reaction
    await this.faqsRepository.createOrUpdateReaction(faqId, userId, reactionType);
  }
}
