import { PostType } from '@prisma/client';
import { IPostCategoryRepository } from '../../domain/repository/postCategoryRepository';
import { postCategoryReposiory } from '../../infrashtructure/repositories/postCategoryRepository';
import { CreatePostCategoryRequest, PostCategoryResponse } from '../../types/postCategoryDTO';

class PostCategoryUsecase {
  constructor(private postCategoryRepostitory: IPostCategoryRepository) {}

  async categoryExists(id: string) {
    return this.postCategoryRepostitory.categoryExists(id);
  }

  async getAllByType(type: PostType): Promise<PostCategoryResponse[]> {
    return this.postCategoryRepostitory.getAllByType(type);
  }

  async createCategory(param: CreatePostCategoryRequest): Promise<PostCategoryResponse> {
    return this.postCategoryRepostitory.createCategory(param);
  }
}

export const postCategoryUsecase = new PostCategoryUsecase(postCategoryReposiory);
