import { IPostCategoryRepository } from '../../domain/repository/postCategoryRepository';
import { postCategoryReposiory } from '../../infrashtructure/repositories/postCategoryRepository';

class PostCategoryUsecase {
  constructor(private postCategoryRepostitory: IPostCategoryRepository) {}

  async categoryExists(id: string) {
    return this.postCategoryRepostitory.categoryExists(id);
  }
}

export const postCategoryUsecase = new PostCategoryUsecase(postCategoryReposiory);
