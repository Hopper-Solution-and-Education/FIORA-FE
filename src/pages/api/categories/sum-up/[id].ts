import { categoryUseCase } from '@/features/setting/api/domain/use-cases/categoryUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { Currency } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId);

    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { year, id } = req.query as { year: string; id: string };
    const currency = (req.headers['x-user-currency'] as string as Currency) ?? Currency.VND;

    const categories = await categoryUseCase.getTransactionsByCategoryIdAndYear(
      id,
      Number(year),
      userId,
      currency,
    );
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
