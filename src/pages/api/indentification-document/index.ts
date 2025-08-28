import { identificationRepository } from '@/features/setting/api/infrastructure/repositories/indentificationRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { SessionUser } from '@/shared/types/session';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { identificationDocumentSchema } from '@/shared/validators/identificationValidator';
import { KYCStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(
  (req: NextApiRequest, res: NextApiResponse, userId: string, user: SessionUser) =>
    errorHandler(
      async (request, response) => {
        switch (request.method) {
          case 'POST':
            return POST(request, response, userId, user);
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
  const identification = await identificationRepository.getByUserId(userId);

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_IDENTIFICATION_SUCCESS, identification));
}

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  user: SessionUser,
) {
  const { error, value } = validateBody(identificationDocumentSchema, req.body);
  const {
    fileFrontId,
    fileBackId,
    idAddress,
    issuedDate,
    type,
    idNumber,
    filePhotoId,
    issuedPlace,
  } = value;
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const checkVerify = await identificationRepository.getByType(userId, type);
  if (checkVerify) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VERIFY_EXIT));
  }

  const checkIdentification = await identificationRepository.checkIdentification(
    type,
    idNumber,
    userId,
  );
  if (checkIdentification) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VERIFY_EXIT));
  }
  const newIdentification = await identificationRepository.create(
    {
      filePhotoId: filePhotoId || null,
      idNumber: idNumber || null,
      type: type,
      idAddress: idAddress || '',
      issuedDate: issuedDate || null,
      fileBackId: fileBackId || null,
      fileFrontId: fileFrontId || null,
      issuedPlace: issuedPlace || '',
      status: KYCStatus.PENDING,
      User: { connect: { id: userId } },
      createdAt: new Date(),
      updatedAt: new Date(),
      remarks: '',
      id: crypto.randomUUID(),
    },
    user,
  );
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(
        RESPONSE_CODE.CREATED,
        Messages.CREATE_IDENTIFICATION_SUCCESS,
        newIdentification,
      ),
    );
}
