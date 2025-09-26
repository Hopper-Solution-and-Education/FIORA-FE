import { Reaction } from '@prisma/client';
import { IReactNewsRepository } from '../../domain/repository/reactNewsRepository';
import { reactNewsRepository } from '../../infrashtructure/repositories/reactNewsRepository';
import { ReactCreationRequest } from '../../types/reactDTO';
class ReactUsecase {
  constructor(private reactRepo: IReactNewsRepository) {}

  async getReactByNewsIdAndUserId(newsId: string, userId: string): Promise<string | null> {
    const result = await this.reactRepo.getReactByComment(newsId, userId);
    return result;
  }

  async createReact(param: ReactCreationRequest): Promise<Reaction> {
    return this.reactRepo.createReact(param);
  }
}

export const reactUsecase = new ReactUsecase(reactNewsRepository);
