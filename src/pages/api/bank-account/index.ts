import { bankAccountRepository } from '@/features/setting/api/infrastructure/repositories/bankAccountRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { bankAccountSchema } from '@/shared/validators/bankAccountValidator';
import { BankAccountStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    case 'GET':
      return GET(res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(res: NextApiResponse, userId: string) {
  try {
    const bankAccounts = await bankAccountRepository.getById(userId);

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_BANK_ACCOUNT_SUCCESS, bankAccounts));
  } catch (error: any) {
    res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
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

    const newBankAccount = await bankAccountRepository.create({
      ...req.body,
      status: BankAccountStatus.pending,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      remarks: '',
      paymentRefId: req.body?.paymentRefId || null,
      id: crypto.randomUUID(),
    });
    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_BANK_ACCOUNT_SUCCESS, newBankAccount),
      );
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error || Messages.INTERNAL_ERROR));
  }
}
