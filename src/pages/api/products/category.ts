import { createError, createResponse } from '@/config/createResponse';
import prisma from '@/infrastructure/database/prisma';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { PaginationResponse } from '@/shared/types/Common.types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

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
    return createError(res, RESPONSE_CODE.UNAUTHORIZED, Messages.UNAUTHORIZED);
  }

  const userId = session.user.id;

  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res, userId);
      default:
        return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
    }
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error || Messages.INTERNAL_ERROR));
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * pageSize;

    const [categories, total] = await prisma.$transaction([
      prisma.category.findMany({
        where: {
          userId: userId,
        },
        orderBy: [{ type: 'asc' }, { parentId: 'asc' }],
        skip,
        take: pageSize,
      }),
      prisma.category.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    const totalPage = Math.ceil(total / pageSize);

    const paginationResponse: PaginationResponse<(typeof categories)[0]> = {
      data: categories,
      page: page,
      pageSize: pageSize,
      totalPage: totalPage,
    };

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_CATEGORY_SUCCESS, paginationResponse));
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error || Messages.INTERNAL_ERROR));
  }
}
