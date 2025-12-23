import { postCategoryUsecase } from '@/features/news/api/application/usecase/postCategoryUsecase';
import { PostCategoryResponse } from '@/features/news/api/types/postCategoryDTO';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { PostType } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        case 'POST':
          return POST(request, response);
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
  const { type } = req.query;

  const result: PostCategoryResponse[] = await postCategoryUsecase.getAllByType(type as PostType);
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_LIST_POST_TYPE_SUCCESS, result));
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, type, userId } = req.body;

  if (!name || !type || !userId) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createResponse(RESPONSE_CODE.BAD_REQUEST, 'Missing required fields: name, type, userId'),
      );
  }

  const result: PostCategoryResponse = await postCategoryUsecase.createCategory({
    name,
    description,
    type: type as PostType,
    userId,
  });

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_CATEGORY_SUCCESS, result));
}
