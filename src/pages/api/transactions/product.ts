import { createResponse } from '@/config/createResponse';
import prisma from '@/infrastructure/database/prisma';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// Function kiểm tra session của người dùng
async function getUserSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) return null;

  const currentTime = Math.floor(Date.now() / 1000);
  return session.expiredTime > currentTime ? session : null;
}

// API Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session) {
    return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
  }

  const userId = session.user.id;

  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res, userId);
      default:
        return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

// GET: Lấy danh sách giao dịch sản phẩm với pagination
async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    // Lấy danh sách giao dịch
    const transactionsAwaited = prisma.productTransaction.findMany({
      skip,
      take,
      select: {
        product: {
          select: {
            id: true,
            price: true,
            name: true,
            type: true,
            description: true,
            items: true,
            taxRate: true,
            catId: true,
            icon: true,
          },
        },
        transaction: {
          select: {
            id: true,
            userId: true,
            type: true,
          },
        },
      },
      where: {
        transaction: {
          userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Đếm tổng số giao dịch để tính tổng số trang
    const countAwaited = prisma.productTransaction.count({
      where: {
        transaction: {
          userId,
        },
      },
    });

    const [transactions, count] = await Promise.all([transactionsAwaited, countAwaited]);

    const totalPage = Math.ceil(count / take);

    return res.status(RESPONSE_CODE.OK).json(
      createResponse(RESPONSE_CODE.OK, 'Fetched product transactions successfully', {
        data: transactions,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPage,
      }),
    );
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
}
