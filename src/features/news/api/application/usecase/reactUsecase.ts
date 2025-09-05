import { IReactNewsRepository } from '../../domain/repository/reactNewsRepository';
import { reactNewsRepository } from '../../infrashtructure/repositories/reactNewsRepository';
class ReactUsecase {
  constructor(private reactNewsRepository: IReactNewsRepository) {}
}

export const reactUsecase = new ReactUsecase(reactNewsRepository);
