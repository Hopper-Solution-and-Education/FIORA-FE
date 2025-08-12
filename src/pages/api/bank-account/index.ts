import { bankAccountRepository } from '@/features/setting/api/infrastructure/repositories/bankAccountRepository';
import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { bankAccountSchema } from '@/shared/validators/bankAccountValidator';
import { KYCStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
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

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_BANK_ACCOUNT_SUCCESS, bankAccounts));
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { error } = validateBody(bankAccountSchema, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const { kycId } = req.body;
  const checkKyc = await eKycRepository.getById(kycId);
  const existingTemplate = await bankAccountRepository.checkBankAccount(req.body);
  if (existingTemplate) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.EXIT_BANK_ACCOUNT));
  }

  if (!checkKyc) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.KYC_NOT_FOUND, error));
  }

  if (checkKyc.refId) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.KYC_CHECK, error));
  }

  delete req.body.kycId;
  const newBankAccount = await bankAccountRepository.create(
    {
      ...req.body,
      status: KYCStatus.PENDING,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      remarks: '',
      paymentRefId: req.body?.paymentRefId || null,
      id: crypto.randomUUID(),
    },
    kycId,
  );
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_BANK_ACCOUNT_SUCCESS, newBankAccount),
    );
}
