import { FaqReaction, ReactionType } from '../entities/models/faqs';

export interface IFaqReactionRepository {
  createOrUpdateReaction(faqId: string, userId: string, reactionType: ReactionType): Promise<void>;

  getFaqReactions(faqId: string): Promise<FaqReaction[]>;
}
