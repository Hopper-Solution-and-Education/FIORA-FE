import { transactionUseCase } from '@/features/transaction/application/use-cases/transactionUseCase';
import { CURRENCY, Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req, res, userId) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: Messages.METHOD_NOT_ALLOWED });
      }
    },
    req,
    res,
  ),
);

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { filters, page, pageSize, sortBy, search } = req.body;

    (filters.AND ??= []).push({
      AND: [
        { currency: CURRENCY.FX },
        {
          OR: [{ toWallet: { type: 'Saving' } }, { fromWallet: { type: 'Saving' } }],
        },
      ],
    });

    const transactions = await transactionUseCase.getSavingTransactionsPagination({
      page,
      pageSize,
      filters,
      sortBy,
      userId,
      searchParams: search,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_TRANSACTION_SUCCESS, transactions));
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
