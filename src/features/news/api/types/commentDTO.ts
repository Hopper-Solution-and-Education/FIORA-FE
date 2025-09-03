export interface commentCreationNews {
  content: string;
  postId: string;
  userId: string;
}

export interface commentUpdationNews {
  content: string;
  postId: string;
  userId: string;
}

export interface getCommentRequest {
  postId: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: string;
}
