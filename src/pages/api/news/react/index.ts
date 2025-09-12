import { reactUsecase } from '@/features/news/api/application/usecase/reactUsecase';
import { CommentUpdationNews } from '@/features/news/api/types/commentDTO';
import { ReactCreationRequest } from '@/features/news/api/types/reactDTO';
import { userUseCase } from '@/features/setting/api/domain/use-cases/userUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { createErrorResponse, errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { User } from '@prisma/client';
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
  const { newsId, userId } = req.query;
  const userIdParam = String(userId);
  // validation
  //check userId exists
  const user: User | null = await userUseCase.getUserById(userIdParam);
  if (!user) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.USER_NOT_FOUND));
  }

  const result: string | null = await reactUsecase.getReactByNewsIdAndUserId(
    String(newsId),
    userIdParam,
  );
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_LIST_COMMENT_NEWS_SUCCESS, result));
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { newsId, userId, reactType } = req.body;
  const param: ReactCreationRequest = { newsId, userId, reactType };
  const result = await reactUsecase.createReact(param);
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.REACT_NEWS_SUCCESS, result));
}
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const { content, userId } = req.body;
  const param: CommentUpdationNews = { content, userId };
  return res
    .status(RESPONSE_CODE.OK)
    .json(createErrorResponse(RESPONSE_CODE.OK, Messages.REACT_NEWS_SUCCESS));
}
