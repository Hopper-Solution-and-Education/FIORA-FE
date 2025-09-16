import { newsUsecase } from '@/features/news/api/application/usecase/newsUsecase';
import { postCategoryUsecase } from '@/features/news/api/application/usecase/postCategoryUsecase';
import { NewsCreationRequest, NewsQueryParams } from '@/features/news/api/types/newsDTO';
import { userUseCase } from '@/features/setting/api/domain/use-cases/userUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { createErrorResponse, errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { createNewsSchema } from '@/shared/validators/newsValidation';
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        case 'POST':
          return withAuthorization({ POST: [UserRole.ADMIN] })(POST)(request, response);
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
  const {
    page = 1,
    limit = 0,
    filters = { search: '', categories: [] },
    orderBy = 'views',
    orderDirection = 'desc',
  } = req.query;

  const queryParams: NewsQueryParams = {
    page: Number(page),
    limit: Number(limit),
    filters: typeof filters === 'string' ? JSON.parse(filters) : filters,
    orderBy: String(orderBy),
    orderDirection: String(orderDirection),
  };
  console.log('log', queryParams);
  const result = await newsUsecase.getAll(queryParams);
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_LISTNEW_SUCCESS, result));
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { title, description, content, userId, type, categoryId } = req.body;

  const request: NewsCreationRequest = {
    title,
    description,
    content,
    userId,
    type,
    categoryId,
  };
  const validation = validateBody(createNewsSchema, request);
  if (validation.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, validation.error),
      );
  }

  //check userId exists
  const user: User | null = await userUseCase.getUserById(request.userId);
  if (!user) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.USER_NOT_FOUND));
  }

  //check title exists
  const titleExists = await newsUsecase.titleExists(request.title);
  if (titleExists) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.NEWS_TITLE_ALREADY_EXISTS));
  }

  //check category
  const categoryExists = await postCategoryUsecase.categoryExists(request.categoryId);
  if (!categoryExists) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.POST_CATEGORY_NOT_FOUND));
  }

  //Creation
  const result = await newsUsecase.createNews(request);
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.CREATE_NEWS_SUCCESS, result));
}
