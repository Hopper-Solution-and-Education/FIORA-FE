import { bankAccountRepository } from '@/features/setting/api/infrastructure/repositories/bankAccountRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { SessionUser } from '@/shared/types/session';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { bankAccountSchema } from '@/shared/validators/bankAccountValidator';
import { KYCStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(
  (req: NextApiRequest, res: NextApiResponse, userId: string, user: SessionUser) =>
    errorHandler(
      async (request, response) => {
        switch (request.method) {
          case 'POST':
            return POST(request, response, user);
          case 'GET':
            return GET(response, userId);
          default:
            return response
              .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
              .json({ error: Messages.METHOD_NOT_ALLOWED });
        }
      },
      req,
      res,
    ),
);

export async function GET(res: NextApiResponse, userId: string) {
  const bankAccounts = await bankAccountRepository.getByUserId(userId);

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_BANK_ACCOUNT_SUCCESS, bankAccounts));
}

export async function POST(req: NextApiRequest, res: NextApiResponse, user: SessionUser) {
  const { error } = validateBody(bankAccountSchema, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }

  const existingTemplate = await bankAccountRepository.checkBankAccount(req.body);
  if (existingTemplate) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.EXIT_BANK_ACCOUNT));
  }

  const newBankAccount = await bankAccountRepository.create(
    {
      ...req.body,
      status: KYCStatus.PENDING,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      remarks: '',
      paymentRefId: req.body?.paymentRefId || null,
      id: crypto.randomUUID(),
    },
    user,
  );
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_BANK_ACCOUNT_SUCCESS, newBankAccount),
    );
}
