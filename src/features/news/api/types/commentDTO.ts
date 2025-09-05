export interface commentCreationNews {
  content: string;
  postId: string;
  userId: string;
  repLyComment?: string;
}

export interface commentUpdationNews {
  content: string;
  userId: string;
}

export interface getCommentRequest {
  postId: string;
  page: number;
  limit: number;
  orderBy: string;
  orderDirection: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  postId: string;
  createdAt: Date;
  User: {
    id: string;
    email: string;
    avatarId: string | null;
  };
}
