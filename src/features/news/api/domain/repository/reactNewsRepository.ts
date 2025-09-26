import { Reaction } from '@prisma/client';
import { ReactCreationRequest } from '../../types/reactDTO';

export interface IReactNewsRepository {
  getReactByComment(commentId: string, userId: string): Promise<string | null>;
  createReact(reactParam: ReactCreationRequest): Promise<Reaction>;
}
