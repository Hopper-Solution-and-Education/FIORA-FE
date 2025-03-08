import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  switch (request.method) {
    case 'POST':
      return POST(request, response);
    default:
      return response.status(405).json({ error: 'Method not allowed' });
  }
}

// Create a new account
export async function POST(request: NextApiRequest, response: NextApiResponse) {
  try {
    const body = await request.body;

    const session = await getServerSession(request, response, authOptions);
    if (!session || !session.user?.id) {
      return response.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: 'Chưa đăng nhập' });
    }

    const userId = session.user.id;

    const { name, type, currency, balance = 0, limit, icon, parentId, isParentSelected } = body;
    if (!isParentSelected && !parentId) {
      const isCreateMasterAccount = await AccountUseCaseInstance.isOnlyMasterAccount(userId, type);
      if (isCreateMasterAccount) {
        return response.status(400).json({ message: 'Master account already exists' });
      }
    }
    // Create the account
    const account = await AccountUseCaseInstance.create({
      userId,
      name,
      type,
      icon,
      currency,
      balance: balance,
      limit: limit,
      parentId: parentId,
    });

    if (!account) {
      return response.status(400).json({ message: 'Cannot create new account' });
    }
    // If this is a sub-account, update the parent's balance
    response.status(201).json({ message: 'Account created successfully', account });
  } catch (error: any) {
    response.status(500).json({ message: error.message });
  }
}
