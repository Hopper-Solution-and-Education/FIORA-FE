import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Phương thức không được hỗ trợ' });
      }
    },
    req,
    res,
  );

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: 'Chưa đăng nhập' });
  }
  const userId = session.user.id;
  const { balance, dept } = await AccountUseCaseInstance.fetchBalanceByUserId(userId);
  res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, 'Lấy số dư thành công', { balance, dept }));
}
