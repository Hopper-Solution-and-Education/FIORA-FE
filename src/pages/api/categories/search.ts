import { categoryUseCase } from '@/features/setting/api/domain/use-cases/categoryUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { CategoryFilters } from '@/shared/types';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);

    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const params = req.body as CategoryFilters;
    const categories = await categoryUseCase.getCategoriesFilter(userId, params);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_CATEGORY_SUCCESS, categories));
  } catch (error: any) {
    res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
