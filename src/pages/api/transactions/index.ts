import { transactionUseCase } from '@/features/transaction/application/use-cases/transactionUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { Currency } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const currency = (req.headers['x-user-currency'] as string) ?? Currency.USD;

    const { filters, page, pageSize, sortBy, search } = req.body;

    const transactions = await transactionUseCase.getTransactionsPagination({
      page,
      pageSize,
      filters,
      sortBy,
      userId,
      searchParams: search,
      currency,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.GET_TRANSACTION_SUCCESS, transactions));
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
