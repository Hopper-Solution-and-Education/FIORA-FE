import { accountUsecase } from '@/features/news/api/application/usecase/accountUsecase';
import { commentUsecase } from '@/features/news/api/application/usecase/commentUsecase';
import { CommentUpdationNews } from '@/features/news/api/types/commentDTO';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { createErrorResponse, errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody, validateVariable } from '@/shared/utils/validate';
import { commentIdSchema, commetUpdateRequestSchema } from '@/shared/validators/newsValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'PUT':
          return withAuthorization({ PUT: [UserRole.USER, UserRole.CS, UserRole.ADMIN] })(PUT)(
            request,
            response,
          );
        case 'DELETE':
          return withAuthorization({ DELETE: [UserRole.USER, UserRole.CS, UserRole.ADMIN] })(
            DELETE,
          )(request, response);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Method is not allowed' });
      }
    },
    req,
    res,
  );
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const { content, userId } = req.body;
  const { id } = req.query;

  //validation commentId
  const commmentIdValidation = validateVariable(commentIdSchema, id);
  if (commmentIdValidation.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(
          RESPONSE_CODE.BAD_REQUEST,
          Messages.VALIDATION_ERROR,
          commmentIdValidation.error,
        ),
      );
  }
  //parse data
  const commentIdParam = String(id);
  const param: CommentUpdationNews = { content, userId };

  //validation body
  const validationBody = validateBody(commetUpdateRequestSchema, param);
  if (validationBody.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(
          RESPONSE_CODE.BAD_REQUEST,
          Messages.VALIDATION_ERROR,
          validationBody.error,
        ),
      );
  }

  try {
    const result = await commentUsecase.updateComment(param, commentIdParam);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_COMMENT_NEWS_SUCCESS, result));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.UPDATE_COMMENT_NEWS_ERROR));
  }
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
    if (user === UserRole.ADMIN || user === UserRole.CS) {
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
