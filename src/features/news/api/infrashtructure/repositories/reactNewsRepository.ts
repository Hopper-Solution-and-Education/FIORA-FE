import { IReactNewsRepository } from '../../domain/repository/reactNewsRepository';

class ReactNewsRepository implements IReactNewsRepository {
  getReactByComment(commentId: string): Promise<string> {
    console.log(commentId);
    throw new Error('Method not implemented.');
  }
}

export const reactNewsRepository = new ReactNewsRepository();
