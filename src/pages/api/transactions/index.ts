import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { authOptions } from '../auth/[...nextauth]';
import { createError, createResponse } from '@/config/createResponse';
import { Messages } from '@/shared/constants/message';
import { transactionUseCase } from '@/features/transaction/application/use-cases/transactionUseCase';

export async function getUserSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = session.expiredTime - currentTime;
  if (timeLeft <= 0) {
    return null;
  }

  return session;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session || !session.user?.id) {
    return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
  }

  try {
    switch (req.method) {
      case 'POST':
        return POST(req, res, session.user.id);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Method is not allowed' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { filters, page, pageSize, sortBy } = req.body;

    const transactions = await transactionUseCase.getTransactions({
      page,
      pageSize,
      filters,
      sortBy,
      userId,
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
