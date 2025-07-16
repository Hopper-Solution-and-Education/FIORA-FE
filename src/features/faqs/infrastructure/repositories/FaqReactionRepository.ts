import { prisma } from '@/config';
import { FaqReaction, ReactionType } from '../../domain/entities/models/faqs';
import { IFaqReactionRepository } from '../../domain/repositories';

/**
 * Repository for FAQ reaction operations
 */
export class FaqReactionRepository implements IFaqReactionRepository {
  async getFaqReactions(faqId: string): Promise<FaqReaction[]> {
    const reactions = await prisma.reaction.findMany({
      where: { postId: faqId },
      select: {
        id: true,
        reactionType: true,
        userId: true,
      },
    });

    return reactions.map((reaction) => ({
      id: reaction.id,
      reactionType: reaction.reactionType as ReactionType,
      userId: reaction.userId,
    }));
  }

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
        if (existing.reactionType === reactionType) {
          await prisma.reaction.delete({
            where: { id: existing.id },
          });
          return;
        }
        await prisma.reaction.update({
          where: { id: existing.id },
          data: { reactionType, updatedBy: userId },
        });
        return;
      }

      await prisma.reaction.create({
        data: {
          postId: faqId,
          userId,
          reactionType,
          createdBy: userId,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error creating/updating reaction:', error);
      throw error;
    }
  }
}

export const faqReactionRepository = new FaqReactionRepository();
