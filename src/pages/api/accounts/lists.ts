import { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth/next';
// import authOptions from '@/pages/api/auth/[...nextauth]';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the session using NextAuth's getServerSession

  //   const session: { user?: { id?: string } } | null = await getServerSession(req, res, authOptions);
  //   console.log('session', session);
  //   if (!session || !session.user?.id) {
  //     return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: 'Chưa đăng nhập' });
  //   }

  //   const userId = session.user.id;

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

    const accounts = await AccountUseCaseInstance.getAllParentAccount(
      '99b4ca81-5348-4058-a66a-245f720115fa',
    );
    res.status(200).json({ accounts });
  } catch (error: any) {
    res.status(error.status).json({ error: error.message });
  }
}
