import { createResponse } from '@/config/createResponse';
import prisma from '@/infrastructure/database/prisma';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

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
