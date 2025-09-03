import { Post } from '@prisma/client';

export interface ListNewsResponse {
  news: Post[];
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
}

export interface NewsUpdateRequest {
  title: string;
  description?: string;
  content: string;
  type: string;
  categoryId: string;
  userId: string;
}
