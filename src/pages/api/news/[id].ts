import { newsUsercase } from '@/features/news/api/application/usecase/newsUsecase';
import { postCategoryUsecase } from '@/features/news/api/application/usecase/postCategoryUsecase';
import { NewsUpdateRequest } from '@/features/news/api/types/newsDTO';
import { userUseCase } from '@/features/setting/api/domain/use-cases/userUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { createErrorResponse, errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody, validateVariable } from '@/shared/utils/validate';
import {
  commetCreateRequestSchema,
  postIdSchema,
  updateNewsSchema,
} from '@/shared/validators/newsValidation';
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        case 'PUT':
          return withAuthorization({ PUT: [UserRole.ADMIN] })(UPDATE)(request, response);
        case 'DELETE':
          return withAuthorization({ DELETE: [UserRole.ADMIN] })(DELETE)(request, response);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Method is not allowed' });
      }
    },
    req,
    res,
  );
};

export async function UPDATE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const postId: string = id as 'string';
  const { title, description, content, type, categoryId, userId } = req.body;

  const requestParam: NewsUpdateRequest = {
    title,
    description,
    content,
    type,
    categoryId,
    userId,
  };

  //Validation
  const validation = validateBody(updateNewsSchema, requestParam);
  if (validation.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, validation.error),
      );
  }

  //check query param
  const postIdValidation = validateVariable(postIdSchema, postId);
  if (postIdValidation.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(
          RESPONSE_CODE.BAD_REQUEST,
          Messages.VALIDATION_ERROR,
          postIdValidation.error,
        ),
      );
  }

  //check userId exists
  const user: User | null = await userUseCase.getUserById(userId);
  if (!user) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.USER_NOT_FOUND, validation.error),
      );
  }

  //check title exists
  const titleExists = await newsUsercase.titleExists(requestParam.title);
  if (titleExists) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.NEWS_TITLE_ALREADY_EXISTS));
  }

  //check category
  const categoryExists = await postCategoryUsecase.categoryExists(requestParam.categoryId);
  if (!categoryExists) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.POST_CATEGORY_NOT_FOUND));
  }

  //UPdate news

  const result = await newsUsercase.updateNews(requestParam, postId);

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, 'Update news successfully', result));
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const postId = id as 'string';
  const postValidation = validateVariable(postIdSchema, postId);
  if (postValidation.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(
          RESPONSE_CODE.BAD_REQUEST,
          Messages.VALIDATION_ERROR,
          postValidation.error,
        ),
      );
  }

  try {
    await newsUsercase.deleteNews(postId);

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_NEWS_SUCCESS));
  } catch {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.DELETE_NEWS_ERROR));
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { id, userId } = req.query;

  const errorValidation = validateVariable(commetCreateRequestSchema, { id, userId });
  //validation query string
  if (errorValidation.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(
          RESPONSE_CODE.BAD_REQUEST,
          Messages.VALIDATION_ERROR,
          errorValidation.error,
        ),
      );
  }

  const newsIdParam = String(id);
  const userIdParam = String(userId);
  try {
    const newsDetail = await newsUsercase.getNewsByIdAndIncrease(newsIdParam, userIdParam);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_NEWS_DETAIL_SECCESS, newsDetail));
  } catch (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.NEWS_NOT_FOUND));
  }
}
