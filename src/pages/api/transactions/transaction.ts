import { transactionUseCase } from '@/features/transaction/application/use-cases/transactionUseCase';
import { DEFAULT_BASE_CURRENCY } from '@/shared/constants';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { UUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    case 'GET':
      return GET(req, res, userId);
    case 'DELETE':
      return DELETE(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const transactions = await transactionUseCase.listTransactions(userId);
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

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const {
      fromAccountId,
      toCategoryId,
      amount,
      products,
      partnerId,
      remark,
      date,
      fromCategoryId,
      toAccountId,
      type,
      currency,
    } = req.body;

    // Validate date should be in range 30 days in the past from now. Not allowed to be in the future
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const nextYear = new Date(now.getFullYear() + 1, 11, 31);

    if ((date && new Date(date) < thirtyDaysAgo) || new Date(date) > nextYear) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_DATE_RANGE_INPUT_30_DAYS);
    }
    const baseCurrency = DEFAULT_BASE_CURRENCY;

    const transactionData = {
      userId: userId,
      type: type,
      amount: parseFloat(amount),
      fromAccountId: fromAccountId as UUID,
      toAccountId: toAccountId as UUID,
      toCategoryId: toCategoryId as UUID,
      fromCategoryId: fromCategoryId as UUID,
      ...(products && { products }),
      ...(partnerId && { partnerId }),
      ...(remark && { remark }),
      ...(date && { date: new Date(date) }),
      baseCurrency: baseCurrency,
    };

    const newTransaction = await transactionUseCase.createTransaction(transactionData, currency);

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_TRANSACTION_SUCCESS, newTransaction),
      );
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    await transactionUseCase.removeTransaction(id as string, userId);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_TRANSACTION_SUCCESS, null));
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
