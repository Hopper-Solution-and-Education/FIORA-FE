import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { Currency } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

// Define the expected session structure
export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return GET(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Phương thức không được hỗ trợ' });
      }
    },
    req,
    res,
  ),
);

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const currency = (req.headers['x-user-currency'] as string as Currency) ?? Currency.VND;

  const { isParent } = req.query;
  if (isParent) {
    const accounts = await AccountUseCaseInstance.getAllParentAccount(userId);
    return res
      .status(200)
      .json(createResponse(RESPONSE_CODE.OK, 'Lấy danh sách tài khoản thành công', accounts));
  } else {
    const accounts = await AccountUseCaseInstance.getAllAccountByUserId(userId, currency);
    return res
      .status(200)
      .json(createResponse(RESPONSE_CODE.OK, 'Lấy danh sách tài khoản thành công', accounts));
  }
}
