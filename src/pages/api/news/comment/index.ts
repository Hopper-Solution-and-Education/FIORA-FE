import { accountUsecase } from '@/features/news/api/application/usecase/accountUsecase';
import { commentUsecase } from '@/features/news/api/application/usecase/commentUsecase';
import { newsUsercase } from '@/features/news/api/application/usecase/newsUsecase';
import { CommentCreationNews, GetCommentRequest } from '@/features/news/api/types/commentDTO';
import { userUseCase } from '@/features/setting/api/domain/use-cases/userUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { createErrorResponse, errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { commetCreateRequestSchema } from '@/shared/validators/newsValidation';
import { Post, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        case 'POST':
          return withAuthorization({ POST: [UserRole.USER, UserRole.CS, UserRole.ADMIN] })(POST)(
            request,
            response,
          );
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Method is not allowed' });
      }
    },
    req,
    res,
  );

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { newsId, page = 1, limit = 0, orderBy = 'createdAt', orderDirection = 'desc' } = req.query;

  const param: GetCommentRequest = {
    newsId: String(newsId),
    page: Number(page),
    limit: Number(limit),
    orderBy: String(orderBy),
    orderDirection: String(orderDirection),
  };

  const result = await commentUsecase.getListByPostId(param);
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_LIST_COMMENT_NEWS_SUCCESS, result));
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { newsId, content, userId, replyComment } = req.body;
  const param: CommentCreationNews = { newsId, content, userId };
  if (replyComment) {
    param.replyComment = replyComment;
  }

  const validation = validateBody(commetCreateRequestSchema, param);
  if (validation.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, validation.error),
      );
  }

  //check news
  const news: Post | null = await newsUsercase.getNewsById(param.newsId);
  if (!news) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.NEWS_NOT_FOUND));
  }
  //check userId exists
  const user: User | null = await userUseCase.getUserById(param.userId);
  if (!user) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.USER_NOT_FOUND));
  }

  const result = await commentUsecase.createComment(param);
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.CREATE_COMMENT_NEWS_SUCCESS, result));
}
export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { commentId } = req.query;

  const commentIdString = commentId as string;

  const user = await accountUsecase.getRoleByUserId(userId);

  if (commentIdString === userId) {
    await commentUsecase.deleteComment(commentIdString);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createErrorResponse(RESPONSE_CODE.OK, Messages.DELETE_COMMENT_SUCESS));
  } else {
    if (commentId === UserRole.ADMIN || user === UserRole.CS) {
      await commentUsecase.deleteComment(commentIdString);
      return res
        .status(RESPONSE_CODE.OK)
        .json(createErrorResponse(RESPONSE_CODE.OK, Messages.DELETE_COMMENT_SUCESS));
    }
  }
  return res
    .status(RESPONSE_CODE.UNAUTHORIZED)
    .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.UNAUTHORIZED));
}
