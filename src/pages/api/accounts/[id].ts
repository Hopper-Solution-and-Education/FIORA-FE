import { NextApiRequest, NextApiResponse } from 'next';
import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createResponse } from '@/config/createResponse';
import { Messages } from '@/shared/constants/message';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res);
      case 'PUT':
        return PUT(req, res);
      case 'DELETE':
        return DELETE(req, res);
      default:
        return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
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

    const { id } = req.query;

    if (!id) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json({ message: 'Missing account id to update' });
    }

    const account = await AccountUseCaseInstance.findById(id as string);
    if (!account) {
      return res.status(RESPONSE_CODE.NOT_FOUND).json({ message: 'Account not found' });
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Get account successfully', account));
  } catch (error: any) {
    res.status(error.status).json({ error: error.message });
  }
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.id) {
      return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: 'User not logged in yet' });
    }

    const userId = session.user.id;

    const { id } = req.query;
    const { name, type, currency, balance = 0, limit, icon } = req.body;
    if (!id) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT));
    }
    const accountFound = await AccountUseCaseInstance.findByCondition({
      id: id.toString(),
      userId,
    });

    if (!accountFound) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.ACCOUNT_NOT_FOUND));
    }

    // prevent update parent balance account
    if (accountFound.parentId === null && balance) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(
          createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.UPDATE_PARENT_ACCOUNT_NOT_ALLOWED),
        );
    }

    const isValidType = AccountUseCaseInstance.validateAccountType(type, balance, limit);
    if (!isValidType) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Invalid account type' });
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
    });

    if (!updateRes) {
      return res.status(400).json({ message: 'Cannot update sub account' });
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Update account successfully'));
  } catch (error: any) {
    console.log('error', error);
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.id) {
      return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: 'Chưa đăng nhập' });
    }

    const { id } = req.query;
    const deletedRes = await AccountUseCaseInstance.deleteAccount(id as string);

    res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Delete account successfully', deletedRes));
  } catch (error: any) {
    res.status(error.status).json({ error: error.message });
  }
}
