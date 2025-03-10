import { NextApiRequest, NextApiResponse } from 'next';
import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createResponse } from '@/lib/createResponse';

// Define the expected session structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the session using NextAuth's getServerSession

  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Phương thức không được hỗ trợ' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.id) {
      return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: 'Chưa đăng nhập' });
    }

    const userId = session.user.id;

    const { isParent } = req.query;
    if (isParent) {
      const accounts = await AccountUseCaseInstance.getAllParentAccount(userId);
      return res
        .status(200)
        .json(createResponse(RESPONSE_CODE.OK, 'Lấy danh sách tài khoản thành công', accounts));
    } else {
      const accounts = await AccountUseCaseInstance.getAllAccountByUserId(userId);
      return res
        .status(200)
        .json(createResponse(RESPONSE_CODE.OK, 'Lấy danh sách tài khoản thành công', accounts));
    }
  } catch (error: any) {
    res.status(error.status).json({ error: error.message });
  }
}
