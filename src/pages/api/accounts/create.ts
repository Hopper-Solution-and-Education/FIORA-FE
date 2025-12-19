import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { accountCreateBody } from '@/shared/validators/accountValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
        case 'DELETE':
          return DELETE(request, response, userId);
        default:
          return response.status(405).json({ error: 'Method not allowed' });
      }
    },
    req,
    res,
  ),
);

// Create a new account
export async function POST(request: NextApiRequest, response: NextApiResponse, userId: string) {
  const body = await request.body;
  const { name, type, currency, balance = 0, limit, icon, parentId } = body;
  const { error } = validateBody(accountCreateBody, body);
  if (error) {
    return response
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const isValidAccountType = AccountUseCaseInstance.validateAccountType(type, balance, limit);
  if (!isValidAccountType) {
    return response
      .status(400)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.UNSUPPORTED_ACCOUNT_TYPE));
  }
  if (!parentId && parentId === null) {
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
  return response
    .status(201)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_ACCOUNT_SUCCESS, account));
}

export async function DELETE(request: NextApiRequest, response: NextApiResponse, userId: string) {
  const body = await request.body;
  const { parentId, subAccountId } = body;
  await AccountUseCaseInstance.removeSubAccount(userId, parentId, subAccountId);
  response.status(201).json(createResponse(RESPONSE_CODE.CREATED, Messages.DELETE_ACCOUNT_SUCCESS));
}
