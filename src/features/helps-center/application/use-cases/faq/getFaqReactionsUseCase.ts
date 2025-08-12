import { FaqReaction } from '@/features/helps-center/domain/entities/models/faqs';
import { IFaqReactionRepository } from '@/features/helps-center/domain/repositories';
import { faqReactionRepository } from '../../../infrastructure/repositories';

export class GetFaqReactionsUseCase {
  constructor(private readonly faqReactionRepository: IFaqReactionRepository) {}

  async execute(faqId: string): Promise<FaqReaction[]> {
    return this.faqReactionRepository.getFaqReactions(faqId);
  }
}

export const getFaqReactionsUseCase = new GetFaqReactionsUseCase(faqReactionRepository);
