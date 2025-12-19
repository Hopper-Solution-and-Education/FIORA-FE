import { bankAccountRepository } from '@/features/setting/api/infrastructure/repositories/bankAccountRepository';
import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { editBankAccountSchema } from '@/shared/validators/bankAccountValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'PATCH':
          return PATCH(request, response, userId);
        case 'DELETE':
          return DELETE(request, response);
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

export async function PATCH(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id } = req.query;
  const { error } = validateBody(editBankAccountSchema, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const { kycId, remarks, status } = req.body;

  const checkBankAccount = await bankAccountRepository.getById(String(id));
  if (!checkBankAccount) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.BANK_ACCOUNT_NOT_FOUND, error));
  }
  const checkKyc = await eKycRepository.getById(kycId);
  if (!checkKyc) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.KYC_NOT_FOUND, error));
  }
  if (checkKyc.refId != id) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.KYC_NOT_MATCH, error));
  }
  delete req.body.kycId;
  const bankAccount = await bankAccountRepository.verify(
    {
      kycId,
      remarks,
      status,
    },
    id,
    userId,
  );
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.VERIFY_BANK_ACCOUNT_SUCCESS, bankAccount));
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await bankAccountRepository.delete(String(id));
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.DELETE_SUCCESS, null));
}
