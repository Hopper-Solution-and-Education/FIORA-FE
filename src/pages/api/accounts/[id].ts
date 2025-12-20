import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        case 'PUT':
          return PUT(request, response, userId);
        case 'DELETE':
          return DELETE(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Method not allowed' });
      }
    },
    req,
    res,
  ),
);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { id } = req.query;
  if (!id) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Missing account id to update' });
  }
  const account = await AccountUseCaseInstance.findById(id as string);
  if (!account) {
    return res.status(RESPONSE_CODE.NOT_FOUND).json({ message: 'Account not found' });
  }
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, 'Get account successfully', account));
}

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
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
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const { id } = req.query;
    console.log('🗑️ DELETE account - ID:', id, 'userId:', userId);

    const deletedRes = await AccountUseCaseInstance.deleteAccount(id as string, userId);

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Delete account successfully', deletedRes));
  } catch (error: any) {
    console.error('❌ DELETE account error:', error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || 'Failed to delete account',
        ),
      );
  }
}
