import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { Currency } from '@prisma/client';
import { GlobalFilters } from '@/shared/types';

// Define the expected session structure

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  // Get the session using NextAuth's getServerSession

  try {
    switch (req.method) {
      case 'POST':
        return POST(req, res, userId);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Phương thức không được hỗ trợ' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const currency = (req.headers['x-user-currency'] as string as Currency) ?? Currency.VND;
    const params = req.body as GlobalFilters;
    const { isParent } = req.query;
    if (isParent) {
      const accounts = await AccountUseCaseInstance.getAllParentAccount(userId, params);
      return res
        .status(200)
        .json(createResponse(RESPONSE_CODE.OK, 'Lấy danh sách tài khoản thành công', accounts));
    } else {
      const accounts = await AccountUseCaseInstance.getAllAccountByUserId(userId, currency, params);
      return res
        .status(200)
        .json(createResponse(RESPONSE_CODE.OK, 'Lấy danh sách tài khoản thành công', accounts));
    }
  } catch (error: any) {
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
