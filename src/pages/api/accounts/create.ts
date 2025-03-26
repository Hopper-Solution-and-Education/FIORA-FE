import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createResponse } from '@/config/createResponse';
import { Messages } from '@/shared/constants/message';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  switch (request.method) {
    case 'POST':
      return POST(request, response);
    case 'DELETE':
      return DELETE(request, response);
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
      return response
        .status(RESPONSE_CODE.UNAUTHORIZED)
        .json(createResponse(RESPONSE_CODE.UNAUTHORIZED, Messages.UNAUTHORIZED));
    }

    const userId = session.user.id;

    const { name, type, currency, balance = 0, limit, icon, parentId } = body;

    const isValidAccountType = AccountUseCaseInstance.validateAccountType(type, balance, limit);
    if (!isValidAccountType) {
      return response
        .status(400)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.UNSUPPORTED_ACCOUNT_TYPE));
    }

    if (!parentId && parentId !== null) {
      const isCreateMasterAccount = await AccountUseCaseInstance.isOnlyMasterAccount(userId, type);
      if (isCreateMasterAccount) {
        return response
          .status(400)
          .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.MASTER_ACCOUNT_ALREADY_EXISTS));
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
      return response
        .status(400)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.CREATE_ACCOUNT_FAILED));
    }
    // If this is a sub-account, update the parent's balance
    return response
      .status(201)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_ACCOUNT_SUCCESS, account));
  } catch (error: any) {
    return response
      .status(500)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error.message));
  }
}

export async function DELETE(request: NextApiRequest, response: NextApiResponse) {
  try {
    const session = await getServerSession(request, response, authOptions);
    if (!session || !session.user?.id) {
      return response.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: 'Chưa đăng nhập' });
    }

    const userId = session.user.id;

    const body = await request.body;
    const { parentId, subAccountId } = body;

    await AccountUseCaseInstance.removeSubAccount(userId, parentId, subAccountId);
    // If this is a sub-account, update the parent's balance
    response
      .status(201)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.DELETE_ACCOUNT_SUCCESS));
  } catch (error: any) {
    response.status(500).json({ message: error.message });
  }
}
