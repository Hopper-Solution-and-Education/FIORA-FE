import { commentUsecase } from '@/features/news/api/application/usecase/commentUsecase';
import {
  commentCreationNews,
  commentUpdationNews,
  getCommentRequest,
} from '@/features/news/api/types/commentDTO';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { createErrorResponse, errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) =>
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
        case 'PUT':
          return withAuthorization({ PUT: [UserRole.USER, UserRole.CS, UserRole.ADMIN] })(PUT)(
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
  const { postId, page = 1, limit = 0, orderBy = 'createdAt', orderDirection = 'desc' } = req.body;
  const param: getCommentRequest = { postId, page, limit, orderBy, orderDirection };

  const result = await commentUsecase.getListByPostId(param);
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_LIST_COMMENT_NEWS_SUCCESS, result));
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { postId, content, userId } = req.body;
  const param: commentCreationNews = { postId, content, userId };

  const result = await commentUsecase.createComment(param);
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.CREATE_COMMENT_NEWS_SUCCESS, result));
}
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const { content, userId } = req.body;
  const param: commentUpdationNews = { content, userId };
  return res
    .status(RESPONSE_CODE.OK)
    .json(createErrorResponse(RESPONSE_CODE.OK, Messages.GET_LISTNEW_SUCCESS));
}
