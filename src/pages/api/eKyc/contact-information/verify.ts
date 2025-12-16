import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { KYCStatus, KYCType, OtpType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
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

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { otp } = req.body;
  if (!otp) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Otp is required'));
  }
  const checkOtp = await eKycRepository.checkOtp(userId, OtpType.CONTACT);

  if (!checkOtp) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Otp expires'));
  }

  const createDate = new Date(checkOtp.createdAt);
  const expiredAt = new Date(createDate.getTime() + Number(checkOtp?.duration) * 1000);

  if (expiredAt < new Date()) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Otp expires'));
  }

  if (otp.toString() !== checkOtp.otp.toString()) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Invalid verify'));
  }

  const checkByType = await eKycRepository.getByType(userId, KYCType.CONTACT);
  if (checkByType) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.KYC_ACCOUNT));
  }

  await eKycRepository.create({
    type: KYCType.CONTACT,
    fieldName: 'account',
    status: KYCStatus.APPROVAL,
    createdBy: userId.toString(),
    userId: userId.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    id: crypto.randomUUID(),
  });
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.VERIFY_SUCCESS));
}
