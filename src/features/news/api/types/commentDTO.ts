export interface CommentCreationNews {
  content: string;
  newsId: string;
  userId: string;
  replyComment?: string;
}

export interface CommentUpdationNews {
  content: string;
  userId: string;
}

export interface GetCommentRequest {
  newsId: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: string;
}

export interface CommentResponseRepo {
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
export interface CommentResponse {
  id: string;
  content: string;
  newsId: string;
  createdAt: Date;
  User: {
    id: string;
    email: string;
    avatarId: string | null;
  };
}
