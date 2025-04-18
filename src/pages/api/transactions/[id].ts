import { transactionUseCase } from '@/features/transaction/application/use-cases/transactionUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId);
    default:
      return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method is not allowed' });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;

    if (!id) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT + ' id');
    }

    const transactions = await transactionUseCase.getTransactionById(userId, id as string);

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
