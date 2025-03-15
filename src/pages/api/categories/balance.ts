import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createErrorResponse, createResponse } from '@/lib/utils';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/config/message';
import { categoryUseCase } from '@/features/setting/application/use-cases/categoryUseCase';

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

  const userId = session.user.id;

  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res, userId);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json(createErrorResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED));
    }
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createErrorResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const categories = await categoryUseCase.getCategoriesAggreate(userId);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'success', categories, Messages.GET_CATEGORY_SUCCESS));
  } catch (error: any) {
    res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createErrorResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
