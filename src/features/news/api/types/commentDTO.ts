export interface commentCreationNews {
  content: string;
  newsId: string;
  userId: string;
  replyComment?: string;
}

export interface commentUpdationNews {
  content: string;
  userId: string;
}

export interface getCommentRequest {
  newsId: string;
  page: number;
  limit: number;
  orderBy: string;
  orderDirection: string;
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
