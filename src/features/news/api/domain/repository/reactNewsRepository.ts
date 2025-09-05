import { Reaction } from '@prisma/client';
import { reactCreationRequest } from '../../types/reactDTO';

export interface IReactNewsRepository {
  getReactByComment(commentId: string, userId: string): Promise<string | null>;
  createReact(reactParam: reactCreationRequest): Promise<Reaction>;
}
