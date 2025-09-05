import { PostType } from '@prisma/client';
import { CreatePostCategoryRequest, PostCategoryResponse } from '../../types/postCategoryDTO';

export interface IPostCategoryRepository {
  categoryExists(id: string): Promise<boolean>;
  getAllByType(type: PostType): Promise<PostCategoryResponse[]>;
  createCategory(param: CreatePostCategoryRequest): Promise<PostCategoryResponse>;
}
