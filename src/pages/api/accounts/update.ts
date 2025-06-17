import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { accountUpdateBody } from '@/shared/validators/accountValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(
  async (request: NextApiRequest, response: NextApiResponse, userId: string) => {
    switch (request.method) {
      case 'PUT':
        return PUT(request, response, userId);
      default:
        return response.status(405).json({ error: 'Method not allowed' });
    }
  },
);

// Update an account
export async function PUT(request: NextApiRequest, response: NextApiResponse, userId: string) {
  try {
    const body = await request.body;

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

    const { error } = validateBody(accountUpdateBody, body);
    if (error) {
      return response
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
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
