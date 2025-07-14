import { prisma } from '@/config';
import { ReactionType } from '../../domain/entities/models/faqs';

export interface IFaqReactionRepository {
  createOrUpdateReaction(faqId: string, userId: string, reactionType: ReactionType): Promise<void>;
  deleteReaction(faqId: string, userId: string): Promise<void>;
}

/**
 * Repository for FAQ reaction operations
 */
export class FaqReactionRepository implements IFaqReactionRepository {
  async createOrUpdateReaction(
    faqId: string,
    userId: string,
    reactionType: ReactionType,
  ): Promise<void> {
    try {
      const existing = await prisma.reaction.findFirst({
        where: { postId: faqId, userId },
      });

      if (existing) {
        await prisma.reaction.update({
          where: { id: existing.id },
          data: { reactionType, updatedBy: userId },
        });
      } else {
        await prisma.reaction.create({
          data: {
            postId: faqId,
            userId,
            reactionType,
            createdBy: userId,
            updatedAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Error creating/updating reaction:', error);
      throw error;
    }
  }

  async deleteReaction(faqId: string, userId: string): Promise<void> {
    try {
      await prisma.reaction.deleteMany({
        where: { postId: faqId, userId },
      });
    } catch (error) {
      console.error('Error deleting reaction:', error);
      throw error;
    }
  }
}
