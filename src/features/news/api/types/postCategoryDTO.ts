import { PostType } from '@prisma/client';

export interface PostCategoryResponse {
  id: string;
  name: string;
  description: string | null;
  type: PostType;
}

export interface CreatePostCategoryRequest {
  userId: string;
  name: string;
  description: string | null;
  type: PostType;
}
