import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { eKYCSchema } from '@/shared/validators/eKycValicator';
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
  const kyc = await eKycRepository.getById(userId);

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_KYC_SUCCESS, kyc));
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { error } = validateBody(eKYCSchema, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const newKyc = await eKycRepository.create({
    fieldName: req.body.fieldName,
    status: KYCStatus.PENDING,
    createdBy: userId.toString(),
    userId: userId.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    id: crypto.randomUUID(),
  });
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_KYC_SUCCESS, newKyc));
}
