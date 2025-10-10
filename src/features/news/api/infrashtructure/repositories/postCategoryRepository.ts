import { prisma } from '@/config';
import { PostType } from '@prisma/client';
import { IPostCategoryRepository } from '../../domain/repository/postCategoryRepository';
import { CreatePostCategoryRequest, PostCategoryResponse } from '../../types/postCategoryDTO';

class PostCategoryRepository implements IPostCategoryRepository {
  createCategory(param: CreatePostCategoryRequest): Promise<PostCategoryResponse> {
    return prisma.postCategory.create({
      data: {
        name: param.name,
        description: param.description,
        type: param.type,
        createdBy: param.userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
      },
    });
  }

  getAllByType(type: PostType): Promise<PostCategoryResponse[]> {
    return prisma.postCategory.findMany({
      where: {
        type: type,
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
      },
    });
  }
  async categoryExists(id: string): Promise<boolean> {
    return (await prisma.postCategory.findFirst({ where: { id: id } })) ? true : false;
  }
}

export const postCategoryReposiory = new PostCategoryRepository();
