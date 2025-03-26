import { NextApiRequest, NextApiResponse } from 'next';
import { transactionUseCase } from '@/features/transaction/application/use-cases/transactionUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UUID } from 'crypto';
import { createError, createResponse } from '@/config/createResponse';
import { Messages } from '@/shared/constants/message';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    case 'GET':
      return GET(req, res, userId);
    case 'PUT':
      return PUT(req, res, userId);
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
    } = req.body;

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
    };

    const newTransaction = await transactionUseCase.createTransaction(transactionData);

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

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const {
      id,
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
    } = req.body;

    const transactionData = {
      id: id,
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
    };
    const updatedTransaction = await transactionUseCase.editTransaction(
      id,
      userId,
      transactionData,
    );
    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(RESPONSE_CODE.OK, Messages.UPDATE_TRANSACTION_SUCCESS, updatedTransaction),
      );
  } catch (error: any) {
    res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
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
