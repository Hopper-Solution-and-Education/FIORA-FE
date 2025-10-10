import { prisma } from '@/config';
import { Reaction } from '@prisma/client';
import { IReactNewsRepository } from '../../domain/repository/reactNewsRepository';
import { ReactCreationRequest } from '../../types/reactDTO';

class ReactNewsRepository implements IReactNewsRepository {
  async createReact(reactParam: ReactCreationRequest): Promise<Reaction> {
    //find
    const existing = await prisma.reaction.findFirst({
      where: {
        postId: reactParam.newsId,
        userId: reactParam.userId,
      },
    });

    //check
    if (existing) {
      return prisma.reaction.update({
        where: { id: existing.id },
        data: {
          reactionType: reactParam.reactType,
          updatedBy: reactParam.userId,
        },
      });
    }

    //create
    return prisma.reaction.create({
      data: {
        postId: reactParam.newsId,
        userId: reactParam.userId,
        reactionType: reactParam.reactType as unknown as string,
        createdBy: reactParam.userId,
      },
    });
  }

  async getReactByComment(newsId: string, userId: string): Promise<string | null> {
    const reaction = await prisma.reaction.findFirst({
      where: {
        postId: newsId,
        userId: userId,
      },
      select: {
        reactionType: true,
      },
    });
    return reaction?.reactionType ? reaction.reactionType : null;
  }
}

export const reactNewsRepository = new ReactNewsRepository();
