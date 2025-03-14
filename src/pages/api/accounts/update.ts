import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createResponse } from '@/config/createResponse';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  switch (request.method) {
    case 'PUT':
      return PUT(request, response);
    default:
      return response.status(405).json({ error: 'Method not allowed' });
  }
}

// Create a new account
export async function PUT(request: NextApiRequest, response: NextApiResponse) {
  try {
    const body = await request.body;

    const session = await getServerSession(request, response, authOptions);
    if (!session || !session.user?.id) {
      return response.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: 'Chưa đăng nhập' });
    }

    const userId = session.user.id;

    const { id } = request.query;
    const { name, type, currency, balance = 0, limit, icon, parentId } = body;

    if (!id) {
      return response
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json({ message: 'Missing account id to update' });
    }

    const accountFound = await AccountUseCaseInstance.findById(id as string);
    if (!accountFound) {
      return response
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json({ message: 'Cannot update sub account' });
    }

    const isValidType = AccountUseCaseInstance.validateAccountType(type, balance, limit);
    if (!isValidType) {
      return response.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Invalid account type' });
    }
    // If this is a sub-account, update the parent's balance

    const updateRes = await AccountUseCaseInstance.updateAccount(id as string, {
      name,
      type,
      icon,
      currency,
      balance: balance,
      limit: limit,
      updatedBy: userId,
      parent: parentId,
    });

    if (!updateRes) {
      return response.status(400).json({ message: 'Cannot update sub account' });
    }

    return response
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, 'Update account successfully'));
  } catch (error: any) {
    response.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}
