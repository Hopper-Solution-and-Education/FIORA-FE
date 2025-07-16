import { FaqReaction } from '../../domain/entities/models/faqs';
import { IFaqReactionRepository } from '../../domain/repositories/IFaqReactionRepository';
import { faqReactionRepository } from '../../infrastructure/repositories';

export class GetFaqReactionsUseCase {
  constructor(private readonly faqReactionRepository: IFaqReactionRepository) {}

  async execute(faqId: string): Promise<FaqReaction[]> {
    return this.faqReactionRepository.getFaqReactions(faqId);
  }
}

export const getFaqReactionsUseCase = new GetFaqReactionsUseCase(faqReactionRepository);
