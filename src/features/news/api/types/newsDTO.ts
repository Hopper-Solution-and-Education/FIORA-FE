import { Post, PostType } from '@prisma/client';
import { ReactCreationRequest } from './reactDTO';

export interface ListNewsResponse {
  news: NewsResponse[];
  currentPage?: number;
  limit?: number;
}

export interface DeleteNewsRequest {
  id: string;
  userId: string;
}

export interface NewsQueryParams {
  page?: number;
  limit?: number;
  filters?: {
    search?: string;
    categories?: string[];
  };
  orderBy?: string;
  orderDirection?: string;
}

export interface NewsCreationRequest {
  title: string;
  description: string;
  content: string;
  userId: string;
  type: string;
  categoryId: string;
  thumbnail?: string;
}

export interface NewsUpdateRequest {
  title: string;
  description?: string;
  content: string;
  type: string;
  categoryId: string;
  userId: string;
  thumbnail?: string;
}

export interface NewsResponse {
  id: string;
  title: string;
  description?: string | null;
  content: string;
  type: PostType;
  thumbnail: string | null;
  userId: string;
  PostCategory: {
    id: string;
    name: string;
  };
}
export interface NewsDetailResponse {
  id: string;
  title: string;
  description?: string | null;
  content: string;
  type: PostType;
  categoryId: string;
  userId: string;
  thumbnail: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  User: {
    email: string;
  };
  Reaction: {
    reactionType: string;
  };
}
export interface NewsDetail extends Post {
  Comment?: NewsResponse[];
  Reaction?: ReactCreationRequest[];
  // Optional related articles when using ?include=related
  relatedArticles?: Post[];
}
